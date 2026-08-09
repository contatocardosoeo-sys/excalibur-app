import Link from 'next/link'

export interface ModuloStubProps {
  codigo: string
  titulo: string
  subtitulo: string
  descricao: string
  features: string[]
  fase?: string
}

export default function ModuloStub({
  codigo,
  titulo,
  subtitulo,
  descricao,
  features,
  fase = 'Fase 1',
}: ModuloStubProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 md:px-10 py-10">
      <Link
        href="/dossiery/base"
        className="font-mono-d text-[11px] tracking-[0.16em] uppercase text-muted-foreground hover:text-primary transition"
      >
        ← Base
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
            {codigo}
          </div>
          <h1 className="font-serif-d text-3xl md:text-4xl mt-2">{titulo}</h1>
          <p className="text-muted-foreground mt-1">{subtitulo}</p>
        </div>
        <span className="shrink-0 mt-1 rounded-[3px] border border-border font-mono-d text-[10px] tracking-widest uppercase px-2 py-1 text-muted-foreground">
          Em construção · {fase}
        </span>
      </div>

      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground/90">{descricao}</p>

      <div className="mt-8 rounded-md border border-border bg-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
          <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            O que esta tela vai fazer
          </span>
        </div>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex gap-3 text-[14px] text-muted-foreground leading-relaxed">
              <span className="text-primary mt-0.5">→</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
