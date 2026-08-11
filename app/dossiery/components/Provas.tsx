import Image from 'next/image'
import { PROVAS_PUBLICAVEIS } from '@/app/lib/dossiery/provas'

// Bloco de prova social. Enquanto não houver depoimento autorizado, não
// renderiza nada: a página fica honesta por padrão, sem ninguém precisar
// lembrar de tirar placeholder antes de subir tráfego.
export default function Provas() {
  if (PROVAS_PUBLICAVEIS.length === 0) return null

  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <div className="font-mono-d text-[11px] tracking-[0.24em] uppercase text-[hsl(var(--brass))]">
            Quem já virou o jogo
          </div>
          <h2 className="font-serif-d text-3xl md:text-[2.4rem] mt-3">
            Não é promessa minha. É relato deles.
          </h2>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {PROVAS_PUBLICAVEIS.map((p) => (
            <figure key={p.nome + p.data} className="rounded-md border border-border bg-card p-5">
              {p.print && (
                <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden border border-border mb-4">
                  <Image src={p.print} alt={`Conversa de ${p.nome}, dados dela ocultos`} fill className="object-cover" />
                </div>
              )}
              <blockquote className="text-[14.5px] leading-relaxed text-foreground">
                “{p.texto}”
              </blockquote>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-muted-foreground">
                  <b className="text-foreground">{p.nome}</b>, {p.contexto}
                </span>
                <span className="font-mono-d text-[10px] tracking-wide uppercase text-[hsl(145_35%_55%)]">
                  {p.resultado}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60 mt-8">
          Resultados individuais. Não há garantia de resultado igual.
        </p>
      </div>
    </section>
  )
}
