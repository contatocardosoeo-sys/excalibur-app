// Cliente Claude (Anthropic) via fetch — sem SDK, runtime-agnóstico.
// Lê ANTHROPIC_API_KEY de forma preguiçosa (nunca no escopo do módulo),
// para não quebrar o build quando a env não está setada.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

// Modelo do Coach — padrão Opus 5, trocável por env para calibrar custo.
export function coachModel() {
  return process.env.DOSSIERY_COACH_MODEL || 'claude-opus-5'
}

function apiKey() {
  const k = process.env.ANTHROPIC_API_KEY
  if (!k) throw new Error('ANTHROPIC_API_KEY não configurada')
  return k
}

function headers() {
  return {
    'x-api-key': apiKey(),
    'anthropic-version': ANTHROPIC_VERSION,
    'content-type': 'application/json',
  }
}

// Chamada não-streaming → devolve o texto concatenado (ou o JSON, se houver schema).
export async function anthropicText(params: {
  system: string
  messages: ChatMessage[]
  maxTokens?: number
  effort?: 'low' | 'medium' | 'high'
  outputSchema?: object
}): Promise<string> {
  const body: Record<string, unknown> = {
    model: coachModel(),
    // max_tokens cobre thinking + texto — dar folga evita truncar a resposta.
    max_tokens: params.maxTokens ?? 8000,
    system: params.system,
    messages: params.messages,
    // Adaptive + effort baixo: rápido/barato sem os modos de falha do disabled.
    thinking: { type: 'adaptive' },
    output_config: params.outputSchema
      ? { effort: params.effort ?? 'medium', format: { type: 'json_schema', schema: params.outputSchema } }
      : { effort: params.effort ?? 'medium' },
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 300)}`)
  }
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> }
  return (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text || '')
    .join('')
}

// Chamada streaming → devolve um ReadableStream de deltas de texto (UTF-8).
export async function anthropicStream(params: {
  system: string
  messages: ChatMessage[]
  maxTokens?: number
  effort?: 'low' | 'medium' | 'high'
}): Promise<ReadableStream<Uint8Array>> {
  const body = {
    model: coachModel(),
    // max_tokens cobre thinking + texto — folga evita truncar no meio.
    max_tokens: params.maxTokens ?? 8000,
    system: params.system,
    messages: params.messages,
    thinking: { type: 'adaptive' },
    output_config: { effort: params.effort ?? 'low' },
    stream: true,
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok || !res.body) {
    const t = await res.text().catch(() => '')
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 300)}`)
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let buffer = ''

  const parseSSE = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (!payload || payload === '[DONE]') continue
        try {
          const evt = JSON.parse(payload) as {
            type?: string
            delta?: { type?: string; text?: string }
          }
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta' && evt.delta.text) {
            controller.enqueue(encoder.encode(evt.delta.text))
          }
        } catch {
          // ignora linha parcial / não-JSON
        }
      }
    },
  })

  return res.body.pipeThrough(parseSSE)
}
