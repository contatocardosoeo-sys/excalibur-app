import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, fimDoPeriodo, mapStatus, daquiAMeses } from '@/app/lib/dossiery/stripe'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
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
  const userId = session.client_reference_id || session.metadata?.user_id
  if (!userId) {
    console.error('[stripe-webhook] session sem user_id', session.id)
    return
  }

  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null

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
      status: 'ativo',
      stripe_id: stripeId,
      stripe_customer_id: customerId,
      renova_em: renovaEm,
    },
    { onConflict: 'user_id' }
  )
  if (error) throw new Error(`upsert assinatura: ${error.message}`)
}
