import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import {
  getStripe,
  priceId,
  priceIdBump,
  priceIdAnualDegrau,
  priceIdComandante,
  stripeConfigurado,
  type Tier,
} from '@/app/lib/dossiery/stripe'
import { faixaAtual } from '@/app/lib/dossiery/fundador'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!stripeConfigurado()) {
    return NextResponse.json(
      { error: 'Pagamentos ainda não configurados (STRIPE_SECRET_KEY).' },
      { status: 503 }
    )
  }

  // Guest checkout: comprar NÃO exige conta. Quem já está logado segue logado;
  // quem não está compra pelo e-mail e a conta nasce no webhook, com entrada
  // automática em /dossiery/entrando. Cadastro antes do pagamento é a maior
  // fricção do funil em mobile.
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let tier: Tier = 'operador'
  let bump = false
  try {
    const body = await request.json()
    if (body?.tier === 'recruta' || body?.tier === 'comandante') tier = body.tier
    // compat: chamadas antigas mandavam { ciclo }
    else if (body?.ciclo === 'mensal') tier = 'recruta'
    bump = body?.bump === true
  } catch {
    /* corpo vazio → operador, sem bump */
  }

  const origin = request.nextUrl.origin
  const bumpId = priceIdBump()
  const ciclo = tier === 'recruta' ? 'mensal' : 'anual'

  try {
    const stripe = getStripe()
    const admin = getSupabaseAdmin()

    // Reaproveita customer existente (se o usuário já tentou/assinou antes)
    const { data: assinatura } = user
      ? await supabase
          .from('dossiery_assinaturas')
          .select('stripe_customer_id')
          .eq('user_id', user.id)
          .maybeSingle()
      : { data: null }

    // Degrau REAL: o preço do anual sai do contador do banco, no servidor.
    // O cliente nunca escolhe o preço, só vê o que a faixa vigente oferece.
    let precoPrincipal: string
    if (tier === 'recruta') {
      precoPrincipal = priceId('mensal')
    } else if (tier === 'comandante') {
      precoPrincipal = priceIdComandante()
    } else {
      const { count } = await admin
        .from('dossiery_assinaturas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')
      const f = faixaAtual(count ?? 0)
      // Degraus esgotados: não existe mais anual, cai no mensal cheio.
      precoPrincipal = f.esgotado ? priceId('mensal') : priceIdAnualDegrau(f.indice)
      if (f.esgotado) tier = 'recruta'
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: precoPrincipal, quantity: 1 },
    ]
    // Comandante já leva o Kit dentro: bump só nos outros tiers.
    const comBump = bump && !!bumpId && tier !== 'comandante'
    if (comBump) line_items.push({ price: bumpId as string, quantity: 1 })

    const clienteExistente = assinatura?.stripe_customer_id
    // recruta = assinatura recorrente (cartão) · anual/comandante = pagamento único (PIX + cartão)
    const modo: Stripe.Checkout.SessionCreateParams.Mode =
      tier === 'recruta' ? 'subscription' : 'payment'
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: modo,
      line_items,
      // Convidado passa pela ponte de entrada (cria sessão pelo cs) antes da OTO.
      success_url: `${origin}/dossiery/entrando?cs={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(
        `/dossiery/oferta/encontro?ciclo=${ciclo}&bump=${comBump ? 1 : 0}`
      )}`,
      cancel_url: `${origin}/dossiery/precos`,
      ...(user ? { client_reference_id: user.id } : {}),
      ...(clienteExistente
        ? { customer: clienteExistente }
        : user?.email
          ? { customer_email: user.email }
          : {}),
      metadata: {
        ...(user ? { user_id: user.id } : { guest: '1' }),
        ciclo,
        tier,
        bump: comBump ? '1' : '0',
      },
      allow_promotion_codes: true,
      locale: 'pt-BR',
      // payment_method_types omitido de propósito: o Stripe usa os métodos
      // ativados no painel (cartão + PIX p/ BRL). PIX só aparece em mode=payment.
    }

    if (modo === 'subscription') {
      if (user) params.subscription_data = { metadata: { user_id: user.id } }
    } else {
      // Recibo por e-mail + guarda o user no payment_intent p/ o webhook.
      // setup_future_usage SÓ no cartão (PIX não suporta): habilita o
      // upsell de 1 clique pós-compra sem redigitar o cartão.
      // installments: parcelamento BR no cartão (até 12x) — exige o recurso
      // ativado no painel Stripe; sem ele, o checkout segue à vista normal.
      params.payment_intent_data = {
        metadata: { ...(user ? { user_id: user.id } : { guest: '1' }), ciclo },
      }
      params.payment_method_options = {
        card: { setup_future_usage: 'off_session', installments: { enabled: true } },
      }
      if (!clienteExistente) params.customer_creation = 'always'
    }

    const session = await stripe.checkout.sessions.create(params)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[dossiery/checkout]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao iniciar o checkout. Tente de novo.' }, { status: 502 })
  }
}
