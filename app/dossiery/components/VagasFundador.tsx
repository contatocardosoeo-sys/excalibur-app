'use client'

import { useEffect, useState } from 'react'
import { DEGRAUS, PRECO_DEPOIS } from '@/app/lib/dossiery/fundador'

export interface FaixaAPI {
  degrau: string
  indice: number
  preco: number
  parcela: number
  restantesNoDegrau: number
  vagasDoDegrau: number
  esgotado: boolean
}

const INICIAL: FaixaAPI = {
  degrau: DEGRAUS[0].nome,
  indice: 0,
  preco: DEGRAUS[0].preco,
  parcela: DEGRAUS[0].parcela,
  restantesNoDegrau: DEGRAUS[0].vagas,
  vagasDoDegrau: DEGRAUS[0].vagas,
  esgotado: false,
}

// Busca a faixa real no banco. Serve o texto e, opcionalmente, avisa o pai
// (a página de preços usa o preço do degrau no botão).
export function useFaixa(onFaixa?: (f: FaixaAPI) => void) {
  const [faixa, setFaixa] = useState<FaixaAPI>(INICIAL)
  useEffect(() => {
    fetch('/api/dossiery/vagas')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (typeof d?.preco === 'number') {
          setFaixa(d)
          onFaixa?.(d)
        }
      })
      .catch(() => {})
    // onFaixa é estável no uso atual (setState do pai)
  }, [onFaixa])
  return faixa
}

// Contador real do degrau vigente. Nada de timer que reseta.
export default function VagasFundador({ className = '' }: { className?: string }) {
  const f = useFaixa()

  if (f.esgotado) {
    return (
      <span className={className}>
        Degraus de fundador esgotados. Agora é R${PRECO_DEPOIS}/mês, sem plano anual.
      </span>
    )
  }

  const proximo = DEGRAUS[f.indice + 1]

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span>
        Faixa <b className="text-foreground">{f.degrau}</b>: restam{' '}
        <b className="text-foreground tabular-nums">{f.restantesNoDegrau}</b> de {f.vagasDoDegrau} por
        R${f.preco}.{' '}
        {proximo
          ? `Quando fechar, o próximo paga R$${proximo.preco}.`
          : `Depois desta faixa, só mensal de R$${PRECO_DEPOIS}.`}
      </span>
    </span>
  )
}
