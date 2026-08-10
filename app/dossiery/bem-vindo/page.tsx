import Link from 'next/link'
import { Suspense } from 'react'
import CompraTrack from './CompraTrack'

export default function BemVindoPage() {
  return (
    <div className="dossiery min-h-screen d-grid-bg grid place-items-center px-6 bg-background text-foreground">
      <Suspense fallback={null}>
        <CompraTrack />
      </Suspense>
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid place-items-center w-20 h-20 rounded-full border border-[hsl(var(--brass))] text-[hsl(var(--brass))] relative">
          <span className="absolute inset-[7px] rounded-full border border-dashed border-[hsl(var(--brass)/0.5)]" />
          <span className="font-serif-d text-3xl">♠</span>
        </div>
        <div className="mt-6 font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          Pagamento confirmado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Bem-vindo ao arsenal, Operador.</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed">
          Cartão libera na hora; se você pagou no PIX, o acesso abre assim que a transferência cair
          (costuma ser 1-2 minutos). A partir de agora, o dossiê é sobre você: seu jogo, sua
          evolução, seu resultado.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dossiery/coach"
            className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 transition"
          >
            Falar com o Coach agora →
          </Link>
          <Link
            href="/dossiery/base"
            className="rounded-[4px] border border-border text-[14px] py-3 hover:border-primary hover:text-primary transition"
          >
            Ir para a Base
          </Link>
        </div>
        <p className="mt-6 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Garantia de 7 dias · qualquer coisa, fala com a gente
        </p>
      </div>
    </div>
  )
}
