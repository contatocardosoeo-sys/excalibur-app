import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { faixaAtual, TOTAL_VAGAS, PRECO_DEPOIS } from '@/app/lib/dossiery/fundador'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Degrau REAL de preço: conta assinaturas ativas e devolve a faixa vigente.
// É a mesma função usada pelo checkout no servidor, então a vitrine nunca
// promete um preço que o checkout não honra.
export async function GET() {
  let vendidos = 0
  try {
    const admin = getSupabaseAdmin()
    const { count } = await admin
      .from('dossiery_assinaturas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo')
    vendidos = count ?? 0
  } catch {
    // envs ausentes (preview/dev) → pré-lançamento: primeiro degrau aberto (verdade)
  }

  const f = faixaAtual(vendidos)
  return NextResponse.json(
    {
      degrau: f.degrau.nome,
      indice: f.indice,
      preco: f.degrau.preco,
      parcela: f.degrau.parcela,
      restantesNoDegrau: f.restantesNoDegrau,
      vagasDoDegrau: f.degrau.vagas,
      esgotado: f.esgotado,
      totalVagas: TOTAL_VAGAS,
      precoDepois: PRECO_DEPOIS,
      vendidos,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } }
  )
}
