import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { getStripe, stripeConfigurado } from '@/app/lib/dossiery/stripe'

export const runtime = 'nodejs'

// Portal do cliente Stripe: atualizar cartão, trocar plano, cancelar.
// Transparência total — cancelamento em 2 cliques faz parte da marca.
export async function POST(request: NextRequest) {
  if (!stripeConfigurado()) {
    return NextResponse.json({ error: 'Pagamentos não configurados.' }, { status: 503 })
  }

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Faça login.' }, { status: 401 })

  const { data: assinatura } = await supabase
    .from('dossiery_assinaturas')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!assinatura?.stripe_customer_id) {
    return NextResponse.json({ error: 'Nenhuma assinatura encontrada.' }, { status: 404 })
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: assinatura.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/dossiery/conta`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[dossiery/portal]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao abrir o portal.' }, { status: 502 })
  }
}
