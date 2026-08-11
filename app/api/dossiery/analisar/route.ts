import { NextRequest, NextResponse } from 'next/server'
import { anthropicText } from '@/app/lib/dossiery/claude'
import { ANALISAR_SYSTEM, ANALISAR_SCHEMA } from '@/app/lib/dossiery/coachPrompt'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo, temAssinaturaAtiva } from '@/app/lib/dossiery/assinatura'
import { passouDoTeto, registrarUso, TETO_30D } from '@/app/lib/dossiery/uso'

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

  // Gate: login + assinatura (pulado com DOSSIERY_GATE=off, p/ preview)
  let userId: string | null = null
  if (process.env.DOSSIERY_GATE !== 'off') {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Faça login para analisar conversas.' }, { status: 401 })
    }
    if (paywallAtivo() && !(await temAssinaturaAtiva(supabase, user.id))) {
      return NextResponse.json(
        { error: 'Assine o Dossiery para destravar o Analisador.', url: '/dossiery/precos' },
        { status: 402 }
      )
    }
    userId = user.id
    if (await passouDoTeto(userId, 'analisar')) {
      return NextResponse.json(
        {
          error:
            `Você passou de ${TETO_30D.analisar} raio-x em 30 dias. Isso é muito acima do ` +
            'uso normal. Fala comigo pelo suporte que a gente libera.',
        },
        { status: 429 }
      )
    }
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
    const uid = userId
    const jsonText = await anthropicText({
      system: ANALISAR_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
      effort: 'medium',
      outputSchema: ANALISAR_SCHEMA,
      // Sem cache aqui: o system tem ~275 tokens (abaixo do piso de 512) e
      // cada análise é uma conversa diferente. Não há prefixo reaproveitável.
      onUso: uid ? (uso) => void registrarUso(uid, 'analisar', uso) : undefined,
    })
    const resultado = JSON.parse(jsonText) as AnaliseResultado
    return NextResponse.json({ resultado })
  } catch (err) {
    console.error('[dossiery/analisar]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha na análise. Tente de novo.' }, { status: 502 })
  }
}
