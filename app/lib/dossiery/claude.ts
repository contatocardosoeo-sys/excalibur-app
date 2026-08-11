// Cliente Claude (Anthropic) via fetch — sem SDK, runtime-agnóstico.
// Lê ANTHROPIC_API_KEY de forma preguiçosa (nunca no escopo do módulo),
// para não quebrar o build quando a env não está setada.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

// Tokens consumidos em uma chamada. Serve para medir COGS real por usuário
// em vez de estimar: sem isso não dá para saber quem custa caro.
export type Uso = {
  entrada: number
  saida: number
  cacheLido: number
  cacheEscrito: number
}

// ── Prompt caching ────────────────────────────────────────────────────────
// Cache hit custa 10% do preço de entrada. Sem cache, cada turno reenvia a
// conversa inteira como input novo e o custo cresce ao quadrado da conversa:
// 15 turnos viram 73.800 tokens de entrada para 8.500 de conversa real.
// Piso cacheável no Opus 5 é 512 tokens, e o system do Coach tem ~810, então
// ele passa sozinho. O segundo marcador vai na última mensagem: no turno
// seguinte todo esse prefixo vira leitura de cache.
// Limite da API: 4 marcadores por request. Usamos 2.
const EFEMERO = { type: 'ephemeral' as const }

type BlocoTexto = {
  type: 'text'
  text: string
  cache_control?: typeof EFEMERO
}

function systemBlocos(system: string, cache: boolean): string | BlocoTexto[] {
  if (!cache) return system
  return [{ type: 'text', text: system, cache_control: EFEMERO }]
}

function mensagensBlocos(messages: ChatMessage[], cache: boolean) {
  if (!cache || messages.length === 0) return messages
  const ultima = messages.length - 1
  return messages.map((m, i) =>
    i === ultima
      ? { role: m.role, content: [{ type: 'text', text: m.content, cache_control: EFEMERO }] }
      : m
  )
}

function lerUso(u: Record<string, unknown> | undefined | null): Uso {
  const n = (v: unknown) => (typeof v === 'number' ? v : 0)
  return {
    entrada: n(u?.input_tokens),
    saida: n(u?.output_tokens),
    cacheLido: n(u?.cache_read_input_tokens),
    cacheEscrito: n(u?.cache_creation_input_tokens),
  }
}

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
  // Só vale a pena com system acima do piso de 512 tokens e prefixo reaproveitado.
  cache?: boolean
  onUso?: (uso: Uso) => void
}): Promise<string> {
  const cache = params.cache === true
  const body: Record<string, unknown> = {
    model: coachModel(),
    // max_tokens cobre thinking + texto — dar folga evita truncar a resposta.
    max_tokens: params.maxTokens ?? 8000,
    system: systemBlocos(params.system, cache),
    messages: mensagensBlocos(params.messages, cache),
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
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>
    usage?: Record<string, unknown>
  }
  params.onUso?.(lerUso(data.usage))
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
  // Chamado quando o stream fecha, com o uso somado do turno.
  onUso?: (uso: Uso) => void
}): Promise<ReadableStream<Uint8Array>> {
  const body = {
    model: coachModel(),
    // max_tokens cobre thinking + texto — folga evita truncar no meio.
    max_tokens: params.maxTokens ?? 8000,
    system: systemBlocos(params.system, true),
    messages: mensagensBlocos(params.messages, true),
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
  // message_start traz entrada e cache; message_delta traz a saída final.
  const uso: Uso = { entrada: 0, saida: 0, cacheLido: 0, cacheEscrito: 0 }

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
            message?: { usage?: Record<string, unknown> }
            usage?: Record<string, unknown>
          }
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta' && evt.delta.text) {
            controller.enqueue(encoder.encode(evt.delta.text))
          } else if (evt.type === 'message_start') {
            const u = lerUso(evt.message?.usage)
            uso.entrada = u.entrada
            uso.cacheLido = u.cacheLido
            uso.cacheEscrito = u.cacheEscrito
            uso.saida = u.saida
          } else if (evt.type === 'message_delta') {
            const u = lerUso(evt.usage)
            if (u.saida) uso.saida = u.saida
          }
        } catch {
          // ignora linha parcial / não-JSON
        }
      }
    },
    flush() {
      params.onUso?.(uso)
    },
  })

  return res.body.pipeThrough(parseSSE)
}
