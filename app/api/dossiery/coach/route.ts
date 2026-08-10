import { NextRequest, NextResponse } from 'next/server'
import { anthropicStream, type ChatMessage } from '@/app/lib/dossiery/claude'
import { COACH_SYSTEM } from '@/app/lib/dossiery/coachPrompt'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_MESSAGES = 40
const MAX_CHARS = 8000

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'IA não configurada. Defina ANTHROPIC_API_KEY no ambiente.' },
      { status: 503 }
    )
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const raw = Array.isArray(body.messages) ? body.messages : []
  const messages: ChatMessage[] = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Envie ao menos uma mensagem do usuário' }, { status: 400 })
  }

  try {
    const stream = await anthropicStream({
      system: COACH_SYSTEM,
      messages,
      effort: 'low',
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[dossiery/coach]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao falar com o Coach. Tente de novo.' }, { status: 502 })
  }
}
