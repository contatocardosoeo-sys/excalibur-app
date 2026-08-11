import { createHash } from 'crypto'

// ♠ Meta Conversions API — eventos server-side com dedup por event_id.
// O pixel do browser some em iOS/adblock; a CAPI garante que Purchase/Lead
// chegam ao Meta mesmo assim. event_id = mesmo id usado no fbq do client
// (sessão de checkout / payment intent / id do lead) → o Meta deduplica.
//
// Fire-and-forget: NUNCA derruba webhook/checkout por falha de tracking.
// Envs: NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_TOKEN (sem eles, no-op).

type EventoCapi = {
  event_name: 'Purchase' | 'Lead' | 'InitiateCheckout'
  event_id: string
  value?: number
  currency?: string
  email?: string | null
  url?: string
}

function sha256(v: string): string {
  return createHash('sha256').update(v.trim().toLowerCase()).digest('hex')
}

export async function enviarCapi(ev: EventoCapi): Promise<void> {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixel || !token) return

  const body = {
    data: [
      {
        event_name: ev.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.event_id,
        action_source: 'website',
        event_source_url: ev.url || 'https://app.dossiery.com.br/dossiery',
        user_data: {
          ...(ev.email ? { em: [sha256(ev.email)] } : {}),
        },
        ...(ev.value != null
          ? { custom_data: { value: ev.value, currency: ev.currency || 'BRL' } }
          : {}),
      },
    ],
  }

  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 4000)
    await fetch(`https://graph.facebook.com/v21.0/${pixel}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctl.signal,
    })
    clearTimeout(timer)
  } catch (err) {
    console.error('[capi]', ev.event_name, err instanceof Error ? err.message : err)
  }
}
