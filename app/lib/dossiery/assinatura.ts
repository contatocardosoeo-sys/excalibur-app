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
    .select('status')
    .eq('user_id', userId)
    .maybeSingle()
  return data?.status === 'ativo'
}
