import type { Metadata } from 'next'
import OfertaCliente from '../../components/OfertaCliente'
import { TOTAL_JOGADAS } from '@/app/lib/dossiery/protocoloEncontro'

export const metadata: Metadata = {
  title: 'Última chamada — Protocolo Encontro · Dossiery',
  robots: { index: false },
}

// ♠ Downsell — só aparece pra quem recusou a OTO. Janela real de 60min
// imposta no servidor (/api/dossiery/upsell devolve 410 depois disso).
export default function DownsellPage() {
  return (
    <div className="min-h-screen d-grid-bg grid place-items-center px-6 py-12">
      <main className="w-full max-w-lg">
        <div className="text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
            Espera — última chamada · janela de 60 minutos
          </div>
          <h1 className="font-serif-d text-4xl md:text-5xl mt-4 leading-[1.05]">
            Ok. Metade do preço.
            <br />
            <span className="text-primary">Mas é agora.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
            Mesmas {TOTAL_JOGADAS} jogadas. Mesmo Protocolo. Nada removido.{' '}
            <span className="text-foreground">R$47 em vez de R$97</span> — válido por 60 minutos
            depois da sua compra, e o servidor cumpre: passou a janela, acabou, e o preço volta pra
            R$147 dentro do app.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <ul className="space-y-3">
            {[
              'A véspera anti-bolo — nunca mais descobrir o cancelamento na porta do bar',
              'A janela do beijo — os 90% seus, os 10% dela, lidos sem atropelo',
              'O D+1 que puxa o segundo encontro (em vez do “chegou bem?” que mata tudo)',
            ].map((b) => (
              <li key={b} className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-snug">
                <span className="text-primary font-bold shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
          <p className="font-serif-d text-3xl">
            <span className="line-through text-muted-foreground text-xl mr-2">R$97</span>
            <span className="text-primary">R$47</span>
          </p>
          <div className="mt-4">
            <OfertaCliente
              oferta="encontro_down"
              valor={47}
              cta="Destravar por R$47 — 1 clique →"
              next="/dossiery/oferta/perfil"
              declineHref="/dossiery/oferta/perfil"
              declineLabel="Deixar pra lá (e pagar R$147 se eu mudar de ideia) →"
              nota="Um clique no cartão salvo · ou PIX na hora"
            />
          </div>
        </div>

        <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Garantia de 7 dias · depois dessa tela, essa condição não existe mais
        </p>
      </main>
    </div>
  )
}
