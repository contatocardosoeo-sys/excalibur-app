import type { SupabaseClient } from '@supabase/supabase-js'
import { stripeConfigurado } from './stripe'

// O paywall só é exigido quando o Stripe está configurado (e não desligado à mão).
// Permite rodar preview/dev com o produto aberto antes de plugar o billing.
export function paywallAtivo(): boolean {
  return stripeConfigurado() && process.env.DOSSIERY_PAYWALL !== 'off'
}

export async function temAssinaturaAtiva(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('dossiery_assinaturas')
    .select('plano, status, renova_em')
    .eq('user_id', userId)
    .maybeSingle()
  // 'recruta' é o default da tabela (ex.: linha criada só pela compra do kit) —
  // não é plano pago. Acesso pago exige plano definido pelo webhook ('operador').
  if (!data || data.status !== 'ativo' || !data.plano || data.plano === 'recruta') return false
  // Anual one-time expira em renova_em; assinatura mensal tem renova_em no futuro
  // (renovada via webhook) ou pode ficar sem data — nesse caso o status manda.
  if (data.renova_em && new Date(data.renova_em).getTime() < Date.now()) return false
  return true
}

// Kit 50 Aberturas (order bump) — entitlement vitalício, independe do plano.
export async function temKitAberturas(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('dossiery_assinaturas')
    .select('kit_aberturas')
    .eq('user_id', userId)
    .maybeSingle()
  return data?.kit_aberturas === true
}
