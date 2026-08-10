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
    .select('status, renova_em')
    .eq('user_id', userId)
    .maybeSingle()
  if (data?.status !== 'ativo') return false
  // Anual one-time expira em renova_em; assinatura mensal tem renova_em no futuro
  // (renovada via webhook) ou pode ficar sem data — nesse caso o status manda.
  if (data.renova_em && new Date(data.renova_em).getTime() < Date.now()) return false
  return true
}
