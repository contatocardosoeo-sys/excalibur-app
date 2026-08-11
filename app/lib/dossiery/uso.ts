import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { coachModel } from './claude'
import type { Uso } from './claude'

// ♠ Medição de consumo de IA e política de uso justo.
//
// O produto vende Raio-X e Coach ilimitados e isso continua verdade para
// qualquer uso humano: o teto abaixo é 5x o perfil pesado que a auditoria
// mediu (40 sessões/mês). Ele não existe para limitar cliente, existe para
// que um laço automatizado ou uma conta compartilhada não gere uma fatura
// aberta. Quem encosta no teto é caso de conversa, não de bloqueio silencioso.

export type Recurso = 'coach' | 'analisar'

export const TETO_30D: Record<Recurso, number> = {
  coach: 300, // ~10 mensagens/dia todo dia
  analisar: 300,
}

const JANELA_DIAS = 30

/** Quantas chamadas o usuário fez deste recurso na janela. */
export async function usoNaJanela(userId: string, recurso: Recurso): Promise<number> {
  const desde = new Date(Date.now() - JANELA_DIAS * 24 * 60 * 60 * 1000).toISOString()
  const admin = getSupabaseAdmin()
  const { count, error } = await admin
    .from('dossiery_uso')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('recurso', recurso)
    .gte('criado_em', desde)
  // Falha de leitura não pode barrar o produto: na dúvida, libera.
  if (error) {
    console.error('[dossiery/uso] leitura', error.message)
    return 0
  }
  return count ?? 0
}

/** true quando o usuário já passou do teto da janela. */
export async function passouDoTeto(userId: string, recurso: Recurso): Promise<boolean> {
  return (await usoNaJanela(userId, recurso)) >= TETO_30D[recurso]
}

/**
 * Registra o consumo. Nunca lança: medição quebrada não pode derrubar a
 * resposta que o usuário já recebeu.
 */
export async function registrarUso(
  userId: string,
  recurso: Recurso,
  uso: Uso
): Promise<void> {
  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('dossiery_uso').insert({
      user_id: userId,
      recurso,
      entrada: uso.entrada,
      saida: uso.saida,
      cache_lido: uso.cacheLido,
      cache_escrito: uso.cacheEscrito,
      modelo: coachModel(),
    })
    if (error) console.error('[dossiery/uso] insert', error.message)
  } catch (e) {
    console.error('[dossiery/uso]', e instanceof Error ? e.message : e)
  }
}
