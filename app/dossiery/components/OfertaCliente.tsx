'use client'

import Link from 'next/link'
import { useState } from 'react'

// ♠ Botão de compra do funil — usado na OTO, no downsell e nas páginas
// bloqueadas do app. Fala com /api/dossiery/upsell:
//   { ok }  → cobrou no cartão salvo (1 clique) → pixel + segue o fluxo
//   { url } → sem cartão salvo (ex.: PIX) → redireciona pro checkout
//   410     → janela da oferta expirou → manda pro destino de preço cheio
export default function OfertaCliente({
  oferta,
  valor,
  cta,
  next,
  declineHref,
  declineLabel,
  nota,
}: {
  oferta: string
  valor: number
  cta: string
  next: string
  declineHref?: string
  declineLabel?: string
  nota?: string
}) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function comprar() {
    if (loading) return
    setErro(null)
    setLoading(true)
    window.fbq?.('track', 'InitiateCheckout', { value: valor, currency: 'BRL' })
    try {
      const res = await fetch('/api/dossiery/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oferta, next }),
      })
      const data = await res.json().catch(() => null)

      if (res.status === 401) {
        window.location.href = data?.entrar || '/dossiery/entrar'
        return
      }
      if (res.status === 410) {
        window.location.href = data?.destino || next
        return
      }
      if (data?.ok) {
        if (!data.ja_tinha) {
          const id = typeof data.id === 'string' ? data.id : undefined
          window.fbq?.('track', 'Purchase', { value: valor, currency: 'BRL' }, id ? { eventID: id } : undefined)
          window.gtag?.('event', 'purchase', { value: valor, currency: 'BRL', transaction_id: id })
        }
        window.location.href = next
        return
      }
      if (data?.url) {
        window.location.href = data.url
        return
      }
      throw new Error(data?.error || `Erro ${res.status}`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha inesperada')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={comprar}
        disabled={loading}
        className="w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[16px] py-4 hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Processando…' : cta}
      </button>
      {nota && (
        <p className="mt-2.5 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
          {nota}
        </p>
      )}
      {erro && (
        <div className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive text-center">
          {erro}
        </div>
      )}
      {declineHref && (
        <div className="mt-5 text-center">
          <Link
            href={declineHref}
            className="text-[12.5px] text-muted-foreground/70 underline underline-offset-4 hover:text-muted-foreground transition"
          >
            {declineLabel || 'Não, obrigado'}
          </Link>
        </div>
      )}
    </div>
  )
}
