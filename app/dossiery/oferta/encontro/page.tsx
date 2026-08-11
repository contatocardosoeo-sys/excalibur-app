import { Suspense } from 'react'
import type { Metadata } from 'next'
import CompraTrack from '../../bem-vindo/CompraTrack'
import OfertaCliente from '../../components/OfertaCliente'
import { PROTOCOLO_ENCONTRO, TOTAL_JOGADAS } from '@/app/lib/dossiery/protocoloEncontro'

export const metadata: Metadata = {
  title: 'Oferta única — Protocolo Encontro · Dossiery',
  robots: { index: false },
}

// ♠ OTO — upsell pós-compra. O cliente acabou de pagar; o Purchase do plano
// dispara aqui (CompraTrack). Aceitou → bem-vindo. Recusou → downsell.
export default function OtoEncontroPage() {
  return (
    <div className="min-h-screen d-grid-bg">
      <Suspense fallback={null}>
        <CompraTrack />
      </Suspense>

      <main className="mx-auto max-w-xl px-6 py-12">
        {/* confirmação primeiro — ele acabou de pagar */}
        <div className="rounded-[5px] border border-[hsl(145_35%_35%)] bg-[hsl(145_35%_20%/0.15)] px-4 py-3 text-center">
          <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(145_35%_55%)]">
            ✓ Pagamento confirmado — seu acesso está sendo liberado
          </span>
        </div>

        <div className="mt-8 text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
            Não fecha essa tela — oferta de uma vez só
          </div>
          <h1 className="font-serif-d text-4xl md:text-[44px] leading-[1.05] mt-4">
            Você resolveu o chat.
            <br />
            <span className="text-primary">Agora falta a mesa.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
            O sistema te leva até o encontro marcado. E é exatamente aí que 90% dos caras queimam
            tudo: entrevista de emprego com talheres, mão gelada na hora do beijo, despedida de
            aperto de mão — e um <span className="text-foreground">“chegou bem?”</span> no dia
            seguinte que enterra a noite inteira.
          </p>
        </div>

        {/* o produto */}
        <div className="mt-8 rounded-lg border border-[hsl(var(--brass)/0.5)] bg-card p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[hsl(var(--brass))]" />
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            Protocolo Encontro · {TOTAL_JOGADAS} jogadas
          </div>
          <p className="font-serif-d text-[22px] mt-2 leading-snug">
            Da chegada ao beijo — e do beijo ao segundo encontro. Cada jogada com o porquê.
          </p>
          <ul className="mt-5 space-y-2.5">
            {PROTOCOLO_ENCONTRO.map((f) => (
              <li key={f.fase} className="flex gap-2.5 text-[13.5px] leading-snug">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">{f.codinome}</span> — {f.objetivo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* preço + CTA isolado */}
        <div className="mt-8 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
          <p className="text-[14px] text-muted-foreground">
            Dentro do app, ele custa <span className="line-through">R$147</span>.
          </p>
          <p className="font-serif-d text-3xl mt-1">
            Nesta tela — e só nesta tela — <span className="text-primary">R$97</span>.
          </p>
          <div className="mt-5">
            <OfertaCliente
              oferta="encontro_oto"
              valor={97}
              cta="SIM — adicionar o Protocolo por R$97 →"
              next="/dossiery/oferta/perfil"
              declineHref="/dossiery/oferta/ultima"
              declineLabel="Não. Prefiro improvisar na mesa e ver no que dá →"
              nota="Cartão salvo? 1 clique, sem redigitar. PIX? Um QR e pronto."
            />
          </div>
        </div>

        <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Coberto pela mesma garantia de 7 dias da sua compra
        </p>
      </main>
    </div>
  )
}
