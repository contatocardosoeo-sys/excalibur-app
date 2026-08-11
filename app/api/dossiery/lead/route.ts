import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { enviarCapi } from '@/app/lib/dossiery/capi'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ARQS = new Set(['B', 'E', 'F', 'G', 'P', 'O'])

// ♠ Captura de lead do quiz Raio-X (topo do funil, pré-conta).
// Grava via service role (a tabela não tem policy pública de propósito).
export async function POST(request: NextRequest) {
  let body: {
    email?: string
    arquetipo?: string
    score?: number
    respostas?: number[]
    origem?: string
    consent?: boolean
    whatsapp?: string
  } | null = null
  try {
    body = await request.json()
  } catch {
    /* inválido */
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }
  if (body?.consent !== true) {
    return NextResponse.json({ error: 'É preciso aceitar receber o resultado.' }, { status: 400 })
  }

  const arquetipo = ARQS.has(body?.arquetipo ?? '') ? body!.arquetipo : null
  const score =
    typeof body?.score === 'number' && body.score >= 0 && body.score <= 100
      ? Math.round(body.score)
      : null
  const respostas =
    Array.isArray(body?.respostas) && body.respostas.length <= 20
      ? body.respostas.filter((n) => typeof n === 'number').slice(0, 20)
      : null
  const origem = typeof body?.origem === 'string' ? body.origem.slice(0, 300) : null
  // WhatsApp opcional: só dígitos, tamanho de telefone BR (com ou sem DDI).
  const zapCru = typeof body?.whatsapp === 'string' ? body.whatsapp.replace(/\D/g, '') : ''
  const whatsapp = zapCru.length >= 10 && zapCru.length <= 13 ? zapCru : null

  try {
    const admin = getSupabaseAdmin()
    const linha = {
      email,
      arquetipo,
      score,
      respostas,
      origem,
      whatsapp,
      consent: true,
      updated_at: new Date().toISOString(),
    }

    const { error } = await admin.from('dossiery_leads').insert(linha)
    if (error) {
      // e-mail repetido (índice único em lower(email)) → atualiza o resultado
      if (error.code === '23505') {
        const { error: upErr } = await admin
          .from('dossiery_leads')
          .update({
            arquetipo,
            score,
            respostas,
            ...(whatsapp ? { whatsapp } : {}),
            updated_at: linha.updated_at,
          })
          .ilike('email', email)
        if (upErr) throw new Error(upErr.message)
      } else {
        throw new Error(error.message)
      }
    }

    // CAPI Lead server-side; o client dispara fbq('Lead') com o mesmo eventID
    const eventId = randomUUID()
    void enviarCapi({ event_name: 'Lead', event_id: eventId, email })

    return NextResponse.json({ ok: true, eventId })
  } catch (err) {
    console.error('[dossiery/lead]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Falha ao salvar. Tente de novo.' }, { status: 502 })
  }
}
