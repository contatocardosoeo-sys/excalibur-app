import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { enviarCapi } from '@/app/lib/dossiery/capi'
import {
  getStripe,
  stripeConfigurado,
  priceIdOferta,
  colunaDaOferta,
  ofertaTemJanela,
  JANELA_OFERTA_MS,
  OFERTAS,
  type Oferta,
} from '@/app/lib/dossiery/stripe'

export const runtime = 'nodejs'

// ♠ Motor do funil — compra avulsa de oferta (upsell 1-clique / downsell / cross-sell).
//
// Fluxo:
//   1. Cartão salvo no customer (setup_future_usage do checkout principal, ou
//      cartão da assinatura mensal) → cobra AGORA, off-session, 1 clique.
//   2. Sem cartão (comprou no PIX) ou cartão recusou → cria um Checkout normal
//      (PIX + cartão) e devolve a URL. A venda nunca morre por falta de método.
//   3. Preço de funil (OTO R$97 / downsell R$47) só vale na janela real de 60min
//      pós-ativação — depois disso o servidor recusa e manda pro preço de app.
//
// Entitlement: gravado na hora no caminho 1; via webhook (metadata.tipo) no 2.
export async function POST(request: NextRequest) {
  if (!stripeConfigurado()) {
    return NextResponse.json({ error: 'Pagamentos ainda não configurados.' }, { status: 503 })
  }

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Entre na sua conta para continuar.', entrar: '/dossiery/entrar?next=/dossiery/base' },
      { status: 401 }
    )
  }

  let oferta: Oferta | null = null
  let next = '/dossiery/base'
  try {
    const body = await request.json()
    if (OFERTAS.includes(body?.oferta)) oferta = body.oferta as Oferta
    // next: só caminhos internos do produto (nada de open redirect)
    if (typeof body?.next === 'string' && body.next.startsWith('/dossiery')) next = body.next
  } catch {
    /* corpo inválido → oferta null */
  }
  if (!oferta) return NextResponse.json({ error: 'Oferta inválida.' }, { status: 400 })

  const price = priceIdOferta(oferta)
  if (!price) {
    return NextResponse.json({ error: 'Oferta indisponível no momento.' }, { status: 503 })
  }

  const coluna = colunaDaOferta(oferta)
  const admin = getSupabaseAdmin()

  try {
    const { data: linha } = await admin
      .from('dossiery_assinaturas')
      .select('stripe_customer_id, kit_aberturas, protocolo_encontro, plano_7d, perfil_magnetico, recomeco, updated_at')
      .eq('user_id', user.id)
      .maybeSingle()

    // Já tem? Não cobra duas vezes.
    if (linha?.[coluna] === true) {
      return NextResponse.json({ ok: true, ja_tinha: true })
    }

    // Janela real dos preços de funil (60min pós-ativação).
    // Sem linha ainda (webhook do PIX a caminho) → acabou de comprar → vale.
    if (ofertaTemJanela(oferta) && linha?.updated_at) {
      const idade = Date.now() - new Date(linha.updated_at).getTime()
      if (idade > JANELA_OFERTA_MS) {
        const destino = oferta.startsWith('perfil')
          ? '/dossiery/perfil'
          : oferta.startsWith('recomeco')
            ? '/dossiery/recomeco'
            : '/dossiery/encontro'
        return NextResponse.json(
          { error: 'Essa condição expirou (era só na janela pós-compra).', destino },
          { status: 410 }
        )
      }
    }

    const stripe = getStripe()
    const precoObj = await stripe.prices.retrieve(price)
    const amount = precoObj.unit_amount ?? 0
    if (!amount) return NextResponse.json({ error: 'Preço mal configurado.' }, { status: 503 })

    const customerId = linha?.stripe_customer_id || null

    // ── Caminho 1: 1 clique no cartão salvo ──
    if (customerId) {
      const pms = await stripe.customers.listPaymentMethods(customerId, {
        type: 'card',
        limit: 1,
      })
      const cartao = pms.data[0]
      if (cartao) {
        try {
          const pi = await stripe.paymentIntents.create({
            amount,
            currency: precoObj.currency || 'brl',
            customer: customerId,
            payment_method: cartao.id,
            payment_method_types: ['card'],
            off_session: true,
            confirm: true,
            description: `Dossiery — ${oferta}`,
            metadata: { user_id: user.id, tipo: oferta },
          })
          if (pi.status === 'succeeded') {
            const { error } = await admin.from('dossiery_assinaturas').upsert(
              { user_id: user.id, [coluna]: true },
              { onConflict: 'user_id' }
            )
            if (error) throw new Error(`upsert entitlement: ${error.message}`)
            // CAPI server-side (dedup: mesmo event_id do pixel do client = pi.id)
            void enviarCapi({
              event_name: 'Purchase',
              event_id: pi.id,
              value: amount / 100,
              email: user.email,
            })
            return NextResponse.json({ ok: true, id: pi.id, valor: amount / 100 })
          }
          // requires_action etc. → cai pro checkout normal abaixo
        } catch {
          // cartão recusou / exige autenticação → checkout normal salva a venda
        }
      }
    }

    // ── Caminho 2: Checkout (PIX + cartão) — webhook libera via metadata.tipo ──
    const sep = next.includes('?') ? '&' : '?'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: `${request.nextUrl.origin}${next}${sep}up=1`,
      cancel_url: `${request.nextUrl.origin}${next}`,
      client_reference_id: user.id,
      ...(customerId ? { customer: customerId } : { customer_email: user.email ?? undefined }),
      metadata: { user_id: user.id, tipo: oferta },
      payment_intent_data: { metadata: { user_id: user.id, tipo: oferta } },
      ...(customerId ? {} : { customer_creation: 'always' as const }),
      locale: 'pt-BR' as const,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[dossiery/upsell]', oferta, err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao processar. Tente de novo.' }, { status: 502 })
  }
}
