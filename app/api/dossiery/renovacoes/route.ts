import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { JANELA_RENOVACAO_DIAS } from '@/app/lib/dossiery/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ♠ Fila de renovação (D330). Chame de um cron (Vercel Cron, n8n, o que for)
// com o header x-dossiery-cron. Devolve quem vence dentro da janela e ainda
// não foi avisado, e marca como avisado pra não repetir o disparo.
//
// GET  = só lista (dry run, seguro pra conferir)
// POST = lista E marca renovacao_avisada_em (use no disparo real)
async function fila(marcar: boolean) {
  const admin = getSupabaseAdmin()
  const limite = new Date(Date.now() + JANELA_RENOVACAO_DIAS * 86_400_000).toISOString()
  const agora = new Date().toISOString()

  const { data, error } = await admin
    .from('dossiery_assinaturas')
    .select('user_id, email, plano, renova_em')
    .eq('status', 'ativo')
    .is('stripe_id', null) // só anual one-time: mensal renova sozinho
    .is('renovacao_avisada_em', null)
    .lte('renova_em', limite)
    .gte('renova_em', agora)
    .limit(500)

  if (error) throw new Error(error.message)
  const lista = data ?? []

  if (marcar && lista.length > 0) {
    const ids = lista.map((l) => l.user_id)
    await admin
      .from('dossiery_assinaturas')
      .update({ renovacao_avisada_em: agora })
      .in('user_id', ids)
  }

  return lista.map((l) => ({
    user_id: l.user_id,
    email: l.email,
    renova_em: l.renova_em,
    dias: Math.ceil((new Date(l.renova_em as string).getTime() - Date.now()) / 86_400_000),
  }))
}

function autorizado(request: NextRequest) {
  const segredo = process.env.DOSSIERY_CRON_SECRET
  if (!segredo) return false
  return request.headers.get('x-dossiery-cron') === segredo
}

export async function GET(request: NextRequest) {
  if (!autorizado(request)) return NextResponse.json({ error: 'não autorizado' }, { status: 401 })
  try {
    return NextResponse.json({ total: (await fila(false)).length, itens: await fila(false) })
  } catch (err) {
    console.error('[dossiery/renovacoes]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!autorizado(request)) return NextResponse.json({ error: 'não autorizado' }, { status: 401 })
  try {
    const itens = await fila(true)
    return NextResponse.json({ total: itens.length, itens })
  } catch (err) {
    console.error('[dossiery/renovacoes]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
