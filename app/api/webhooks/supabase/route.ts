import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE = 'https://cardosoeo.app.n8n.cloud/webhook'

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Record<string, unknown>
  old_record?: Record<string, unknown>
  schema: string
}

async function dispararN8N(endpoint: string, payload: Record<string, unknown>) {
  try {
    await fetch(`${N8N_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error(`[webhook/supabase] Erro ao disparar N8N ${endpoint}:`, e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SupabaseWebhookPayload = await request.json()
    const { type, table, record, old_record } = body

    // INSERT em leads → disparar fluxo de boas-vindas
    if (table === 'leads' && type === 'INSERT') {
      await dispararN8N('lead-novo', {
        lead_id: record.id,
        nome: record.nome,
        telefone: record.telefone,
        procedimento: record.procedimento,
        origem: record.origem,
        clinica_id: record.clinica_id,
        created_at: record.created_at,
      })
      return NextResponse.json({ ok: true, disparado: 'lead-novo' })
    }

    // UPDATE em leads (etapa mudou para Fechou) → disparar pós-venda
    if (table === 'leads' && type === 'UPDATE') {
      const etapaAnterior = old_record?.etapa
      const etapaAtual = record.etapa
      if (etapaAtual === 'Fechou' && etapaAnterior !== 'Fechou') {
        await dispararN8N('lead-fechou', {
          lead_id: record.id,
          nome: record.nome,
          telefone: record.telefone,
          procedimento: record.procedimento,
          clinica_id: record.clinica_id,
        })
        return NextResponse.json({ ok: true, disparado: 'lead-fechou' })
      }
    }

    // UPDATE em agendamentos → notificar mudança
    if (table === 'agendamentos' && type === 'UPDATE') {
      await dispararN8N('agendamento-update', {
        agendamento_id: record.id,
        paciente_nome: record.paciente_nome,
        data: record.data,
        hora: record.hora,
        status: record.status,
        status_anterior: old_record?.status,
        clinica_id: record.clinica_id,
      })
      return NextResponse.json({ ok: true, disparado: 'agendamento-update' })
    }

    // INSERT em propostas → notificar nova proposta
    if (table === 'propostas' && type === 'INSERT') {
      await dispararN8N('proposta-nova', {
        proposta_id: record.id,
        paciente_nome: record.paciente_nome,
        valor_total: record.valor_total,
        clinica_id: record.clinica_id,
      })
      return NextResponse.json({ ok: true, disparado: 'proposta-nova' })
    }

    return NextResponse.json({ ok: true, ignorado: true })
  } catch (err) {
    console.error('[webhook/supabase]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
