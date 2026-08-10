'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Dispara Purchase (Meta) e purchase (GA4) uma única vez no pós-checkout.
// eventID = id da sessão de checkout → dedup se a página recarregar/CAPI futura.
export default function CompraTrack() {
  const params = useSearchParams()
  const disparado = useRef(false)

  useEffect(() => {
    if (disparado.current) return
    const cs = params.get('cs')
    // Sem cs = visita direta (não veio do checkout) → não dispara compra fantasma
    if (!cs) return
    disparado.current = true

    const ciclo = params.get('ciclo')
    const value = (ciclo === 'anual' ? 697 : 97) + (params.get('bump') === '1' ? 37 : 0)

    window.fbq?.('track', 'Purchase', { value, currency: 'BRL' }, { eventID: cs })
    window.gtag?.('event', 'purchase', { value, currency: 'BRL', transaction_id: cs })
  }, [params])

  return null
}
