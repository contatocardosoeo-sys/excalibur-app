import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hluhlsnodndpskrkbjuw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface EmitEventParams {
  event_name: string
  aggregate_type?: string
  aggregate_id?: string
  clinica_id?: string
  actor_type?: 'user' | 'system' | 'webhook' | 'n8n' | 'cron'
  actor_id?: string
  source_system?: string
  payload?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export async function emitEvent(params: EmitEventParams) {
  const { error } = await supabase.from('eventos_sistema').insert({
    event_name: params.event_name,
    aggregate_type: params.aggregate_type,
    aggregate_id: params.aggregate_id,
    clinica_id: params.clinica_id,
    actor_type: params.actor_type || 'system',
    actor_id: params.actor_id,
    source_system: params.source_system || 'excalibur-app',
    payload_json: params.payload || {},
    metadata_json: params.metadata || {},
    status: 'pending',
  })

  if (error) {
    console.error('[events] Failed to emit:', params.event_name, error.message)
  }

  return !error
}

// Convenience functions for common events
export const Events = {
  leadCreated: (clinicaId: string, leadId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'lead_created', aggregate_type: 'lead', aggregate_id: leadId, clinica_id: clinicaId, payload }),

  leadUpdated: (clinicaId: string, leadId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'lead_updated', aggregate_type: 'lead', aggregate_id: leadId, clinica_id: clinicaId, payload }),

  leadContacted: (clinicaId: string, leadId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'lead_contacted', aggregate_type: 'lead', aggregate_id: leadId, clinica_id: clinicaId, payload }),

  agendamentoCreated: (clinicaId: string, agendId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'agendamento_created', aggregate_type: 'agendamento', aggregate_id: agendId, clinica_id: clinicaId, payload }),

  agendamentoConfirmed: (clinicaId: string, agendId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'agendamento_confirmed', aggregate_type: 'agendamento', aggregate_id: agendId, clinica_id: clinicaId, payload }),

  agendamentoMissed: (clinicaId: string, agendId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'agendamento_missed', aggregate_type: 'agendamento', aggregate_id: agendId, clinica_id: clinicaId, payload }),

  propostaCreated: (clinicaId: string, propId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'proposta_created', aggregate_type: 'proposta', aggregate_id: propId, clinica_id: clinicaId, payload }),

  propostaExpired: (clinicaId: string, propId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'proposta_expired', aggregate_type: 'proposta', aggregate_id: propId, clinica_id: clinicaId, payload }),

  vendaClosed: (clinicaId: string, leadId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'venda_closed', aggregate_type: 'lead', aggregate_id: leadId, clinica_id: clinicaId, payload }),

  paymentReceived: (clinicaId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'payment_received', aggregate_type: 'payment', clinica_id: clinicaId, payload }),

  paymentOverdue: (clinicaId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'payment_overdue', aggregate_type: 'payment', clinica_id: clinicaId, payload }),

  alertaCreated: (clinicaId: string, payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'alerta_created', aggregate_type: 'alerta', clinica_id: clinicaId, payload }),

  workflowFailed: (payload: Record<string, unknown>) =>
    emitEvent({ event_name: 'workflow_failed', actor_type: 'n8n', source_system: 'n8n', payload }),

  userLogin: (clinicaId: string, userId: string, metadata: Record<string, unknown>) =>
    emitEvent({ event_name: 'user_login', aggregate_type: 'user', aggregate_id: userId, clinica_id: clinicaId, actor_type: 'user', actor_id: userId, metadata }),
}
