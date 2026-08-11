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

// ── Esteira: ofertas avulsas (tripwire, upsell 1-clique, downsell, cross-sell) ──
// kit           = Kit 50 Aberturas R$37 (mesmo price do bump)
// encontro_oto  = Protocolo Encontro na OTO pós-compra R$97 (janela 60min)
// encontro_down = downsell do Encontro R$47 (janela 60min)
// encontro_app  = Encontro dentro do app R$147 (âncora real)
// plano7        = Plano 7 Dias R$19 (tripwire do quiz)
// perfil_oto    = Perfil Magnético na OTO2 R$47 (janela 60min)
// perfil_app    = Perfil Magnético dentro do app R$67
// recomeco_oto  = Protocolo Recomeço em oferta R$97 (janela 60min)
// recomeco_app  = Protocolo Recomeço dentro do app R$147
export type Oferta =
  | 'kit'
  | 'encontro_oto'
  | 'encontro_down'
  | 'encontro_app'
  | 'plano7'
  | 'perfil_oto'
  | 'perfil_app'
  | 'recomeco_oto'
  | 'recomeco_app'

export const OFERTAS: Oferta[] = [
  'kit',
  'encontro_oto',
  'encontro_down',
  'encontro_app',
  'plano7',
  'perfil_oto',
  'perfil_app',
  'recomeco_oto',
  'recomeco_app',
]

const PRICE_ENV: Record<Oferta, string | undefined> = {
  kit: process.env.STRIPE_PRICE_BUMP,
  encontro_oto: process.env.STRIPE_PRICE_ENCONTRO_OTO,
  encontro_down: process.env.STRIPE_PRICE_ENCONTRO_DOWN,
  encontro_app: process.env.STRIPE_PRICE_ENCONTRO_APP,
  plano7: process.env.STRIPE_PRICE_PLANO7,
  perfil_oto: process.env.STRIPE_PRICE_PERFIL_OTO,
  perfil_app: process.env.STRIPE_PRICE_PERFIL_APP,
  recomeco_oto: process.env.STRIPE_PRICE_RECOMECO_OTO,
  recomeco_app: process.env.STRIPE_PRICE_RECOMECO_APP,
}

export function priceIdOferta(oferta: Oferta): string | null {
  return PRICE_ENV[oferta] || null
}

// Coluna de entitlement que cada oferta libera em dossiery_assinaturas.
export type ColunaEntitlement =
  | 'kit_aberturas'
  | 'protocolo_encontro'
  | 'plano_7d'
  | 'perfil_magnetico'
  | 'recomeco'

export const COLUNAS_ENTITLEMENT: ColunaEntitlement[] = [
  'kit_aberturas',
  'protocolo_encontro',
  'plano_7d',
  'perfil_magnetico',
  'recomeco',
]

export function colunaDaOferta(oferta: Oferta): ColunaEntitlement {
  if (oferta === 'kit') return 'kit_aberturas'
  if (oferta === 'plano7') return 'plano_7d'
  if (oferta.startsWith('perfil')) return 'perfil_magnetico'
  if (oferta.startsWith('recomeco')) return 'recomeco'
  return 'protocolo_encontro'
}

// Ofertas com preço de funil têm janela real (60min pós-ativação, checada no servidor).
export const JANELA_OFERTA_MS = 60 * 60 * 1000
export function ofertaTemJanela(oferta: Oferta): boolean {
  return oferta === 'encontro_oto' || oferta === 'encontro_down' || oferta === 'perfil_oto' || oferta === 'recomeco_oto'
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
