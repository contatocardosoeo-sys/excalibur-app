import { createSupabaseServer } from '@/app/lib/supabase-server'
import { JANELA_OFERTA_MS } from '@/app/lib/dossiery/stripe'

// Fim REAL da janela de oferta, lido do banco. É a mesma base que
// /api/dossiery/upsell usa pra recusar (410) depois do prazo, então o
// contador da tela nunca promete o que o servidor não honra.
// Sem linha ainda (webhook do PIX a caminho) = acabou de comprar: janela cheia.
export async function fimDaJanela(): Promise<string> {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('dossiery_assinaturas')
        .select('updated_at')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data?.updated_at) {
        return new Date(new Date(data.updated_at).getTime() + JANELA_OFERTA_MS).toISOString()
      }
    }
  } catch {
    /* preview/dev sem env → janela cheia */
  }
  return new Date(Date.now() + JANELA_OFERTA_MS).toISOString()
}
