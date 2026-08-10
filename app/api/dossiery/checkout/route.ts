import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { getStripe, priceId, stripeConfigurado } from '@/app/lib/dossiery/stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!stripeConfigurado()) {
    return NextResponse.json(
      { error: 'Pagamentos ainda não configurados (STRIPE_SECRET_KEY).' },
      { status: 503 }
    )
  }

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Crie sua conta antes de assinar.', entrar: '/dossiery/criar-conta?next=/dossiery/precos' },
      { status: 401 }
    )
  }

  let ciclo: 'mensal' | 'anual' = 'mensal'
  try {
    const body = await request.json()
    if (body?.ciclo === 'anual') ciclo = 'anual'
  } catch {
    /* corpo vazio → mensal */
  }

  const origin = request.nextUrl.origin

  try {
    const stripe = getStripe()

    // Reaproveita customer existente (se o usuário já tentou/assinou antes)
    const { data: assinatura } = await supabase
      .from('dossiery_assinaturas')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId(ciclo), quantity: 1 }],
      success_url: `${origin}/dossiery/bem-vindo?cs={CHECKOUT_SESSION_ID}&ciclo=${ciclo}`,
      cancel_url: `${origin}/dossiery/precos`,
      client_reference_id: user.id,
      ...(assinatura?.stripe_customer_id
        ? { customer: assinatura.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      metadata: { user_id: user.id },
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: true,
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[dossiery/checkout]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao iniciar o checkout. Tente de novo.' }, { status: 502 })
  }
}
