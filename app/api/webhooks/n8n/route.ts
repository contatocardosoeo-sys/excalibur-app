import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hluhlsnodndpskrkbjuw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface N8NEvent {
  tipo: string
  clinica_id?: string
  lead_id?: string
  agendamento_id?: string
  proposta_id?: string
  paciente_id?: string
  dados?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body: N8NEvent = await request.json()
    const { tipo, clinica_id, lead_id, dados } = body

    switch (tipo) {
      case 'lead_sem_resposta': {
        await supabase.from('alertas_sistema').insert({
          tipo: 'sem_resposta',
          prioridade: 'alta',
          titulo: `Lead sem resposta há 24h`,
          descricao: dados?.nome ? `Lead "${dados.nome}" sem contato` : 'Lead sem resposta',
          clinica_id,
          status: 'pendente',
        })
        return NextResponse.json({ ok: true, acao: 'alerta_criado' })
      }

      case 'agendamento_confirmar': {
        if (body.agendamento_id) {
          await supabase.from('agendamentos')
            .update({ status: 'confirmado' })
            .eq('id', body.agendamento_id)
        }
        return NextResponse.json({ ok: true, acao: 'agendamento_confirmado' })
      }

      case 'lead_novo': {
        await supabase.from('alertas_sistema').insert({
          tipo: 'lead_novo',
          prioridade: 'media',
          titulo: `Novo lead: ${dados?.nome || 'sem nome'}`,
          descricao: `Origem: ${dados?.origem || 'desconhecida'}`,
          clinica_id,
          status: 'pendente',
        })
        return NextResponse.json({ ok: true, acao: 'boas_vindas_disparado' })
      }

      case 'proposta_expirada': {
        if (body.proposta_id) {
          await supabase.from('propostas')
            .update({ status: 'negado' })
            .eq('id', body.proposta_id)
        }
        await supabase.from('alertas_sistema').insert({
          tipo: 'proposta_expirada',
          prioridade: 'alta',
          titulo: 'Proposta expirada (7 dias)',
          descricao: dados?.paciente_nome ? `Proposta de ${dados.paciente_nome}` : 'Proposta sem resposta',
          clinica_id,
          status: 'pendente',
        })
        return NextResponse.json({ ok: true, acao: 'proposta_marcada_expirada' })
      }

      case 'paciente_retorno': {
        await supabase.from('alertas_sistema').insert({
          tipo: 'retorno',
          prioridade: 'media',
          titulo: `Lembrete de retorno`,
          descricao: dados?.paciente_nome ? `Retorno de ${dados.paciente_nome}` : 'Paciente precisa de retorno',
          clinica_id,
          status: 'pendente',
        })
        return NextResponse.json({ ok: true, acao: 'lembrete_retorno_criado' })
      }

      case 'lead_nao_atendido': {
        if (lead_id) {
          const { error: rpcError } = await supabase.rpc('decrementar_score', { lead_uuid: lead_id, pontos: 5 })
          if (rpcError) {
            await supabase.from('leads')
              .update({ lead_score: Math.max(0, (Number(dados?.score_atual) || 50) - 5) })
              .eq('id', lead_id)
          }
        }
        await supabase.from('alertas_sistema').insert({
          tipo: 'lead_nao_atendido',
          prioridade: 'critica',
          titulo: 'Lead não atendido em 24h!',
          descricao: dados?.nome ? `"${dados.nome}" aguardando desde ontem` : 'Lead urgente',
          clinica_id,
          status: 'pendente',
        })
        return NextResponse.json({ ok: true, acao: 'alerta_urgente_criado' })
      }

      default:
        return NextResponse.json({ error: `Tipo "${tipo}" não suportado` }, { status: 400 })
    }
  } catch (err) {
    console.error('[webhook/n8n]', err)
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 })
  }
}
