import { NextRequest, NextResponse } from 'next/server'
import { anthropicText } from '@/app/lib/dossiery/claude'
import { ANALISAR_SYSTEM, ANALISAR_SCHEMA } from '@/app/lib/dossiery/coachPrompt'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_CHARS = 16000

export interface AnaliseResultado {
  leitura_dela: string
  diagnostico: Array<{ tipo: 'acerto' | 'erro' | 'alerta'; ponto: string }>
  sugestoes: Array<{ texto: string; porque: string }>
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'IA não configurada. Defina ANTHROPIC_API_KEY no ambiente.' },
      { status: 503 }
    )
  }

  let body: { conversa?: string; contexto?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const conversa = (body.conversa || '').trim().slice(0, MAX_CHARS)
  const contexto = (body.contexto || '').trim().slice(0, 1000)

  if (conversa.length < 20) {
    return NextResponse.json(
      { error: 'Cole a conversa (mínimo ~20 caracteres) pra eu analisar.' },
      { status: 400 }
    )
  }

  const prompt = [
    contexto ? `Contexto do usuário: ${contexto}` : null,
    'Conversa (formato livre, como copiada do app):',
    '---',
    conversa,
    '---',
    'Analise conforme as instruções e responda no JSON pedido.',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const jsonText = await anthropicText({
      system: ANALISAR_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
      effort: 'medium',
      outputSchema: ANALISAR_SCHEMA,
    })
    const resultado = JSON.parse(jsonText) as AnaliseResultado
    return NextResponse.json({ resultado })
  } catch (err) {
    console.error('[dossiery/analisar]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha na análise. Tente de novo.' }, { status: 502 })
  }
}
