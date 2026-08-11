'use client'

import { useState } from 'react'
import { KIT_ABERTURAS, TOTAL_ABERTURAS } from '@/app/lib/dossiery/kitAberturas'

// ♠ Kit liberado — as 50 aberturas por situação, com copiar em 1 toque.
export default function KitView() {
  // numeração contínua 01-50 através dos grupos
  let n = 0

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-10">
      <div className="border-b border-border pb-6">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          08 · Arsenal · acesso vitalício
        </div>
        <h1 className="font-serif-d text-4xl mt-2">Kit {TOTAL_ABERTURAS} Aberturas Que Não Morrem</h1>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-xl leading-relaxed">
          Regra da casa: <span className="text-foreground">nada aqui é pra copiar cego</span>. Toda
          linha vem com o porquê — troque os <span className="font-mono-d text-[12px]">[campos]</span>{' '}
          pelo contexto REAL dela e mande na sua voz. Copiar sem adaptar é Modo Trouxa com atalho.
        </p>
      </div>

      {/* nav de grupos */}
      <div className="mt-6 flex flex-wrap gap-2">
        {KIT_ABERTURAS.map((g, i) => (
          <a
            key={g.grupo}
            href={`#g${i}`}
            className="inline-flex items-center rounded-[4px] border border-border bg-card px-3 min-h-[44px] text-[12px] text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground transition"
          >
            {g.grupo.split('—')[0].trim()}
          </a>
        ))}
      </div>

      {KIT_ABERTURAS.map((g, gi) => (
        <section key={g.grupo} id={`g${gi}`} className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
            <h2 className="font-serif-d text-2xl">{g.grupo}</h2>
          </div>
          <p className="text-[13px] text-muted-foreground mt-2 max-w-xl">{g.desc}</p>

          <div className="mt-4 space-y-3">
            {g.itens.map((a) => {
              n += 1
              return <Abertura key={a.t} n={n} t={a.t} p={a.p} />
            })}
          </div>
        </section>
      ))}

      <p className="mt-12 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        ♠ mandou uma e travou na resposta? Cola a conversa no Analisar — o raio-x é ilimitado.
      </p>
    </div>
  )
}

function Abertura({ n, t, p }: { n: number; t: string; p: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(t)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1600)
    } catch {
      /* clipboard bloqueado — segue sem feedback */
    }
  }

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] mt-1 shrink-0">
          {String(n).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14.5px] leading-relaxed rounded-md rounded-tl-[2px] bg-secondary/60 border border-border px-3.5 py-2.5">
            {t}
          </p>
          <p className="text-[12.5px] text-muted-foreground mt-2 leading-snug">
            <span className="font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))]">
              por quê ·{' '}
            </span>
            {p}
          </p>
        </div>
        <button
          onClick={copiar}
          className={`shrink-0 rounded-[4px] border px-3 min-h-[44px] min-w-[44px] text-[11px] font-mono-d transition ${
            copiado
              ? 'border-[hsl(145_35%_45%)] text-[hsl(145_35%_55%)]'
              : 'border-border text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground'
          }`}
          title="Copiar mensagem"
        >
          {copiado ? '✓ copiado' : 'copiar'}
        </button>
      </div>
    </div>
  )
}
