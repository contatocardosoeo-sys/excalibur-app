'use client'

import { useEffect, useState } from 'react'

// ♠ Contador da janela de 60min. O prazo vem do SERVIDOR (a mesma regra que a
// API usa pra recusar a oferta depois). Não é timer de vitrine que reseta ao
// dar F5: quando zera, o preço acabou de verdade.
export default function PrazoOferta({ fim, className = '' }: { fim: string; className?: string }) {
  const [restante, setRestante] = useState<number | null>(null)

  useEffect(() => {
    const alvo = new Date(fim).getTime()
    const tick = () => setRestante(Math.max(0, alvo - Date.now()))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [fim])

  if (restante === null) return null

  const min = Math.floor(restante / 60000)
  const seg = Math.floor((restante % 60000) / 1000)
  const acabou = restante <= 0
  const urgente = restante < 10 * 60 * 1000

  return (
    <div
      role="timer"
      aria-live="off"
      className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 ${
        acabou
          ? 'border-border text-muted-foreground'
          : urgente
            ? 'border-primary text-primary'
            : 'border-[hsl(var(--brass)/0.6)] text-[hsl(var(--brass))]'
      } ${className}`}
    >
      {!acabou && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 animate-ping motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      <span className="font-mono-d text-[11px] tracking-[0.14em] uppercase tabular-nums">
        {acabou ? 'janela encerrada' : `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')} nesta condição`}
      </span>
    </div>
  )
}
