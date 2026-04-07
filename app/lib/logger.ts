import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hluhlsnodndpskrkbjuw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

type LogTipo = 'info' | 'warn' | 'error' | 'critical'

interface LogParams {
  clinica_id?: string
  user_id?: string
  rota: string
  metodo?: string
  acao: string
  tipo?: LogTipo
  duracao_ms?: number
  status_code?: number
  payload?: Record<string, unknown>
  stack_trace?: string
  ip_address?: string
  user_agent?: string
}

export async function log(params: LogParams) {
  const { error } = await supabase.from('logs_sistema').insert({
    clinica_id: params.clinica_id,
    user_id: params.user_id,
    rota: params.rota,
    metodo: params.metodo || 'GET',
    acao: params.acao,
    tipo: params.tipo || 'info',
    duracao_ms: params.duracao_ms,
    status_code: params.status_code,
    payload: params.payload || {},
    stack_trace: params.stack_trace,
    ip_address: params.ip_address,
    user_agent: params.user_agent,
  })

  if (error) {
    console.error('[logger] Failed to log:', error.message)
  }
}

// Convenience loggers
export const Logger = {
  info: (rota: string, acao: string, extra?: Partial<LogParams>) =>
    log({ rota, acao, tipo: 'info', ...extra }),

  warn: (rota: string, acao: string, extra?: Partial<LogParams>) =>
    log({ rota, acao, tipo: 'warn', ...extra }),

  error: (rota: string, acao: string, extra?: Partial<LogParams>) =>
    log({ rota, acao, tipo: 'error', ...extra }),

  critical: (rota: string, acao: string, extra?: Partial<LogParams>) =>
    log({ rota, acao, tipo: 'critical', ...extra }),

  apiRequest: (rota: string, metodo: string, statusCode: number, durationMs: number, extra?: Partial<LogParams>) =>
    log({
      rota,
      metodo,
      acao: `${metodo} ${rota} → ${statusCode}`,
      tipo: statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info',
      duracao_ms: durationMs,
      status_code: statusCode,
      ...extra,
    }),
}
