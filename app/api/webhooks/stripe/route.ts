import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import {
  getStripe,
  fimDoPeriodo,
  mapStatus,
  daquiAMeses,
  OFERTAS,
  colunaDaOferta,
  ofertaEhUpgradeDePlano,
  type Oferta,
} from '@/app/lib/dossiery/stripe'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { acharOuCriarUsuario } from '@/app/lib/dossiery/conta'
import { enviarCapi } from '@/app/lib/dossiery/capi'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Webhook Stripe → ativa/sincroniza dossiery_assinaturas.
// Eventos a habilitar no painel:
//   checkout.session.completed, checkout.session.async_payment_succeeded,
//   customer.subscription.updated, customer.subscription.deleted
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET ausente' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Sem assinatura' }, { status: 400 })

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = await getStripe().webhooks.constructEventAsync(rawBody, signature, secret)
  } catch (err) {
    console.error('[stripe-webhook] assinatura inválida:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  try {
    switch (event.type) {
      // Cartão liberou na hora (mensal ou anual). PIX pendente cai no async abaixo.
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === 'paid') {
          await ativarPorSession(admin, session)
        }
        // payment_status 'unpaid'/'no_payment_required' (PIX pendente) → espera o async
        break
      }

      // PIX caiu (pagamento assíncrono confirmado) → libera o acesso
      case 'checkout.session.async_payment_succeeded': {
        await ativarPorSession(admin, event.data.object as Stripe.Checkout.Session)
        break
      }

      // Renovou / falhou / cancelou (só assinatura mensal) → sincroniza status
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const status =
          event.type === 'customer.subscription.deleted' ? 'cancelado' : mapStatus(sub.status)

        const patch = {
          status,
          renova_em: fimDoPeriodo(sub),
          stripe_customer_id:
            typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null,
        }

        const userId = sub.metadata?.user_id
        const query = admin.from('dossiery_assinaturas').update(patch)
        const { error } = userId
          ? await query.eq('user_id', userId)
          : await query.eq('stripe_id', sub.id)
        if (error) throw new Error(`update assinatura: ${error.message}`)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe-webhook]', event.type, err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Libera o acesso a partir de uma checkout.session paga (cartão ou PIX).
async function ativarPorSession(admin: SupabaseClient, session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email || null
  let userId = session.client_reference_id || session.metadata?.user_id || null

  // Guest checkout: pagou sem conta. A conta nasce aqui, pelo e-mail da compra.
  if (!userId && email) {
    userId = await acharOuCriarUsuario(admin, email)
    if (!userId) {
      console.error('[stripe-webhook] falhou criar conta do convidado', session.id, email)
      return
    }
  }
  if (!userId) {
    console.error('[stripe-webhook] session sem user_id e sem e-mail', session.id)
    return
  }

  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null

  // ── Oferta avulsa da esteira (tripwire/upsell/downsell/cross-sell via checkout/PIX) ──
  // Libera SÓ o entitlement. Nunca toca plano/status/renova_em: se a linha não
  // existir, o insert cai nos defaults ('recruta') que NÃO passam no paywall.
  const tipo = session.metadata?.tipo
  // Upgrade de plano (OTO pós-tripwire com crédito): vira Operador de 12 meses,
  // com o Kit e o Encontro que o tier carrega.
  if (tipo && ofertaEhUpgradeDePlano(tipo as Oferta)) {
    const { error } = await admin.from('dossiery_assinaturas').upsert(
      {
        user_id: userId,
        plano: 'operador',
        status: 'ativo',
        renova_em: daquiAMeses(12),
        kit_aberturas: true,
        protocolo_encontro: true,
        ...(customerId ? { stripe_customer_id: customerId } : {}),
      },
      { onConflict: 'user_id' }
    )
    if (error) throw new Error(`upgrade operador: ${error.message}`)
    void enviarCapi({
      event_name: 'Purchase',
      event_id: session.id,
      value: (session.amount_total ?? 0) / 100,
      email: session.customer_details?.email || session.customer_email,
    })
    return
  }
  if (tipo && (OFERTAS as string[]).includes(tipo)) {
    const coluna = colunaDaOferta(tipo as Oferta)
    const { error } = await admin.from('dossiery_assinaturas').upsert(
      {
        user_id: userId,
        [coluna]: true,
        ...(customerId ? { stripe_customer_id: customerId } : {}),
      },
      { onConflict: 'user_id' }
    )
    if (error) throw new Error(`upsert oferta ${tipo}: ${error.message}`)
    // CAPI server-side (dedup com o pixel do client via event_id = session.id)
    void enviarCapi({
      event_name: 'Purchase',
      event_id: session.id,
      value: (session.amount_total ?? 0) / 100,
      email: session.customer_details?.email || session.customer_email,
    })
    return
  }

  // ── Compra principal (plano Operador, com ou sem order bump) ──
  let stripeId: string | null = null
  let renovaEm: string | null = null

  if (session.mode === 'subscription') {
    const subId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id ?? null
    stripeId = subId
    if (subId) {
      const sub = await getStripe().subscriptions.retrieve(subId)
      renovaEm = fimDoPeriodo(sub)
    }
  } else {
    // Anual one-time: 12 meses de acesso a partir de agora, sem renovação automática
    renovaEm = daquiAMeses(12)
    stripeId = null
  }

  const { error } = await admin.from('dossiery_assinaturas').upsert(
    {
      user_id: userId,
      plano: 'operador',
      // Tier real da compra: sem isso não dá para medir margem por plano
      // nem aplicar limite de uso diferente por tier.
      tier: session.metadata?.tier === 'recruta' || session.metadata?.tier === 'comandante'
        ? session.metadata.tier
        : 'operador',
      status: 'ativo',
      stripe_id: stripeId,
      stripe_customer_id: customerId,
      renova_em: renovaEm,
      ...(email ? { email } : {}),
      // Order bump marcado no checkout → kit liberado junto (nunca volta a false)
      ...(session.metadata?.bump === '1' ? { kit_aberturas: true } : {}),
      // Comandante leva o arsenal inteiro, vitalício, na hora.
      ...(session.metadata?.tier === 'comandante'
        ? {
            kit_aberturas: true,
            protocolo_encontro: true,
            perfil_magnetico: true,
            recomeco: true,
            plano_7d: true,
          }
        : {}),
    },
    { onConflict: 'user_id' }
  )
  if (error) throw new Error(`upsert assinatura: ${error.message}`)

  // CAPI server-side da compra principal (dedup: mesmo event_id do pixel = cs)
  void enviarCapi({
    event_name: 'Purchase',
    event_id: session.id,
    value: (session.amount_total ?? 0) / 100,
    email: session.customer_details?.email || session.customer_email,
  })
}
