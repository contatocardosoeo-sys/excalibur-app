import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Logger } from '@/app/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hluhlsnodndpskrkbjuw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const event_name = searchParams.get('event_name')
  const status = searchParams.get('status')
  const clinica_id = searchParams.get('clinica_id')

  let query = supabase
    .from('eventos_sistema')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (event_name) query = query.eq('event_name', event_name)
  if (status) query = query.eq('status', status)
  if (clinica_id) query = query.eq('clinica_id', clinica_id)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ eventos: data, total: data?.length || 0 })
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  try {
    const body = await request.json()
    const { event_name, aggregate_type, aggregate_id, clinica_id, actor_type, actor_id, source_system, payload, metadata } = body

    if (!event_name) {
      return NextResponse.json({ error: 'event_name obrigatório' }, { status: 400 })
    }

    const { data, error } = await supabase.from('eventos_sistema').insert({
      event_name,
      aggregate_type,
      aggregate_id,
      clinica_id,
      actor_type: actor_type || 'system',
      actor_id,
      source_system: source_system || 'excalibur-app',
      payload_json: payload || {},
      metadata_json: metadata || {},
      status: 'pending',
    }).select().single()

    if (error) {
      await Logger.error('/api/eventos', `Erro ao criar evento ${event_name}`, { status_code: 500, duracao_ms: Date.now() - start })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await Logger.info('/api/eventos', `Evento criado: ${event_name}`, { duracao_ms: Date.now() - start })
    return NextResponse.json({ evento: data })
  } catch (err) {
    await Logger.error('/api/eventos', 'Erro inesperado', { stack_trace: err instanceof Error ? err.stack : String(err), duracao_ms: Date.now() - start })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
