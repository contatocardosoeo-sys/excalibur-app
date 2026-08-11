'use client'

import { useEffect, useState } from 'react'
import { VAGAS_FUNDADOR } from '@/app/lib/dossiery/fundador'

// Contador real de vagas (do banco). Fallback: total (verdade no pré-lançamento).
export default function VagasFundador({ className = '' }: { className?: string }) {
  const [restantes, setRestantes] = useState<number>(VAGAS_FUNDADOR)

  useEffect(() => {
    fetch('/api/dossiery/vagas')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.restantes === 'number') setRestantes(d.restantes)
      })
      .catch(() => {})
  }, [])

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span>
        Restam <b className="text-foreground tabular-nums">{restantes}</b> das {VAGAS_FUNDADOR} vagas.
        Contador real, direto do banco.
      </span>
    </span>
  )
}
