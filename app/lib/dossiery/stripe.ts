import Stripe from 'stripe'

// Instanciação preguiçosa — nunca no escopo do módulo (não quebra build sem env).
let _stripe: Stripe | null = null

export function stripeConfigurado() {
  return !!process.env.STRIPE_SECRET_KEY
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurada')
  if (!_stripe) _stripe = new Stripe(key)
  return _stripe
}

// Price IDs (criados no painel do Stripe) — plano único "Operador" no MVP.
export function priceId(ciclo: 'mensal' | 'anual'): string {
  const id =
    ciclo === 'anual'
      ? process.env.STRIPE_PRICE_ANUAL
      : process.env.STRIPE_PRICE_MENSAL
  if (!id) throw new Error(`STRIPE_PRICE_${ciclo.toUpperCase()} não configurado`)
  return id
}

// current_period_end mudou de lugar entre versões da API do Stripe
// (raiz da subscription → item). Lê dos dois jeitos, sem quebrar tipos.
export function fimDoPeriodo(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  const raiz = sub as unknown as { current_period_end?: number }
  const epoch = item?.current_period_end ?? raiz.current_period_end
  return epoch ? new Date(epoch * 1000).toISOString() : null
}

// Mapeia status do Stripe → status interno.
export function mapStatus(s: Stripe.Subscription.Status): 'ativo' | 'atrasado' | 'cancelado' {
  if (s === 'active' || s === 'trialing') return 'ativo'
  if (s === 'past_due' || s === 'incomplete') return 'atrasado'
  return 'cancelado' // canceled | unpaid | incomplete_expired | paused
}
