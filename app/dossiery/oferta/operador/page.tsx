import type { Metadata } from 'next'
import Link from 'next/link'
import OfertaCliente from '../../components/OfertaCliente'
import { DEGRAUS } from '@/app/lib/dossiery/fundador'

export const metadata: Metadata = {
  title: 'Seus R$19 viram desconto · Dossiery',
  robots: { index: false },
}

// ♠ OTO pós-tripwire: quem comprou o Plano 7 Dias (R$19) sobe pro Operador
// com o valor creditado. É o degrau que faltava entre R$19 e o plano anual.
export default function OtoOperadorPage() {
  const base = DEGRAUS[0].preco
  const comCredito = base - 19

  return (
    <div className="min-h-screen d-grid-bg">
      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="rounded-[5px] border border-[hsl(145_35%_35%)] bg-[hsl(145_35%_20%/0.15)] px-4 py-3 text-center">
          <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(145_35%_55%)]">
            ✓ Plano 7 Dias liberado. Ele já está te esperando.
          </span>
        </div>

        <div className="mt-8 text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
            Uma pergunta antes de você começar
          </div>
          <h1 className="font-serif-d text-4xl md:text-[42px] leading-[1.05] mt-4">
            Você comprou o mapa.
            <br />
            <span className="text-primary">Quer o cara que anda junto?</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
            O Plano te leva até o D7 com conversa viva e um encontro proposto. Aí acaba. O que vem
            depois do D7 é conversa real, com mulher real, e nenhum PDF resolve isso: o Raio-X vê a
            SUA conversa e aponta o vacilo enquanto acontece.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-[hsl(var(--brass)/0.5)] bg-card p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[hsl(var(--brass))]" />
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            Protocolo Operador · 12 meses
          </div>
          <ul className="mt-4 space-y-2.5">
            {[
              'Raio-X ilimitado das suas conversas',
              'Coach 24/7 que não passa pano',
              'Kit 50 Aberturas incluso',
              'Protocolo Encontro incluso (34 jogadas)',
            ].map((b) => (
              <li key={b} className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-snug">
                <span className="text-primary font-bold shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
          <p className="text-[14px] text-muted-foreground">
            Faixa de fundador hoje: <span className="line-through">R${base}</span>
          </p>
          <p className="font-serif-d text-3xl mt-1">
            Seus R$19 abatidos: <span className="text-primary">R${comCredito}</span>
          </p>
          <p className="font-mono-d text-[10px] tracking-widest uppercase text-primary mt-2">
            o crédito do Plano só vale nesta tela
          </p>
          <div className="mt-5">
            <OfertaCliente
              oferta="operador_credito"
              valor={comCredito}
              cta={`Subir pro Operador por R$${comCredito} →`}
              next="/dossiery/base"
              declineHref="/dossiery/plano7"
              declineLabel="Agora não. Vou fazer os 7 dias primeiro →"
              nota="1 clique no cartão salvo · ou PIX na hora"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
          Recusar não tira nada de você: o Plano 7 Dias continua seu, vitalício. E se mudar de
          ideia depois, o Operador está em{' '}
          <Link href="/dossiery/precos" className="underline underline-offset-4">
            preços
          </Link>{' '}
          pela faixa vigente, sem o crédito.
        </p>
      </main>
    </div>
  )
}
