import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { VAGAS_FUNDADOR } from '@/app/lib/dossiery/fundador'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Contador REAL de vagas de fundador: total - assinaturas ativas no banco.
// Sem número inventado — é o que sustenta a escassez sem queimar a conta.
export async function GET() {
  let restantes = VAGAS_FUNDADOR
  try {
    const admin = getSupabaseAdmin()
    const { count } = await admin
      .from('dossiery_assinaturas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo')
    restantes = Math.max(0, VAGAS_FUNDADOR - (count ?? 0))
  } catch {
    // envs ausentes (preview/dev) → pré-lançamento: todas as vagas abertas (verdade)
  }
  return NextResponse.json(
    { total: VAGAS_FUNDADOR, restantes },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
  )
}
