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
// mensal: price RECORRENTE (mode subscription). anual: price ÚNICO (mode payment).
export function priceId(ciclo: 'mensal' | 'anual'): string {
  const id =
    ciclo === 'anual'
      ? process.env.STRIPE_PRICE_ANUAL
      : process.env.STRIPE_PRICE_MENSAL
  if (!id) throw new Error(`STRIPE_PRICE_${ciclo.toUpperCase()} não configurado`)
  return id
}

// Order bump — price ÚNICO (one-time). Opcional: sem env, o bump não aparece.
export function priceIdBump(): string | null {
  return process.env.STRIPE_PRICE_BUMP || null
}

// ── Funil: ofertas avulsas (upsell 1-clique, downsell, cross-sell in-app) ──
// kit           = Kit 50 Aberturas (R$37 — mesmo price do bump)
// encontro_oto  = Protocolo Encontro na tela pós-compra (R$97, janela de 60min)
// encontro_down = downsell do Encontro (R$47, janela de 60min)
// encontro_app  = Encontro destravado depois, dentro do app (R$147 — âncora real)
export type Oferta = 'kit' | 'encontro_oto' | 'encontro_down' | 'encontro_app'

export const OFERTAS: Oferta[] = ['kit', 'encontro_oto', 'encontro_down', 'encontro_app']

export function priceIdOferta(oferta: Oferta): string | null {
  switch (oferta) {
    case 'kit':
      return process.env.STRIPE_PRICE_BUMP || null
    case 'encontro_oto':
      return process.env.STRIPE_PRICE_ENCONTRO_OTO || null
    case 'encontro_down':
      return process.env.STRIPE_PRICE_ENCONTRO_DOWN || null
    case 'encontro_app':
      return process.env.STRIPE_PRICE_ENCONTRO_APP || null
  }
}

// Coluna de entitlement que cada oferta libera em dossiery_assinaturas.
export function colunaDaOferta(oferta: Oferta): 'kit_aberturas' | 'protocolo_encontro' {
  return oferta === 'kit' ? 'kit_aberturas' : 'protocolo_encontro'
}

// Ofertas com preço de funil têm janela real (60min pós-ativação, checada no servidor).
export const JANELA_OFERTA_MS = 60 * 60 * 1000
export function ofertaTemJanela(oferta: Oferta): boolean {
  return oferta === 'encontro_oto' || oferta === 'encontro_down'
}

// ISO de agora + N meses (usado no acesso do plano anual one-time).
export function daquiAMeses(meses: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + meses)
  return d.toISOString()
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
