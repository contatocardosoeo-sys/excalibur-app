import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Garantia de execução · Dossiery',
  description:
    'Faça as 7 missões. Se em 30 dias nenhuma conversa mudar, devolvo em dobro. As regras, por escrito.',
}

// Regra pública e auditável. Se está escrito aqui, é cumprido.
export default function GarantiaPage() {
  return (
    <div className="min-h-screen d-grid-bg">
      <header className="border-b border-border/70">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <Link href="/dossiery" className="flex items-center gap-2 h-11 -ml-1 px-1">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </Link>
          <Link href="/dossiery/precos" className="d-toque -mr-1 text-[13px] text-muted-foreground hover:text-primary transition">
            Preços
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-14">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(145_35%_55%)]">
          Garantia de execução
        </div>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-3 leading-[1.05]">
          Faça as 7 missões. Se nada mudar,
          <br />
          <span className="text-[hsl(145_35%_55%)]">devolvo em dobro.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed">
          A maioria promete "satisfação garantida" e repete a lei. Aqui a aposta é outra: eu pago
          pra ver. Se você executar e o seu jogo não mudar, você sai com o dobro do que pagou.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            As duas garantias
          </div>
          <div className="mt-4 space-y-5">
            <div>
              <h2 className="font-serif-d text-lg">1. Arrependimento, 7 dias, sem pergunta</h2>
              <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                Comprou e não quis? Pede pelo suporte em até 7 dias e recebe 100% de volta. É o
                artigo 49 do Código de Defesa do Consumidor. Não precisa justificar nada.
              </p>
            </div>
            <div>
              <h2 className="font-serif-d text-lg">2. Execução, 30 dias, em dobro</h2>
              <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                Essa é minha. Se você cumprir as condições abaixo e ainda assim nenhuma conversa
                sua tiver mudado, devolvo o valor pago e mais o mesmo valor por fora.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border-2 border-[hsl(145_35%_35%)] bg-[hsl(145_35%_20%/0.12)] p-6">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(145_35%_55%)]">
            O que você precisa ter feito
          </div>
          <ol className="mt-4 space-y-3">
            {[
              'Concluir as 7 missões do Plano 7 Dias. O app marca cada uma: nada de palavra contra palavra.',
              'Colar pelo menos 10 conversas suas no Raio-X ao longo dos 30 dias.',
              'Ter proposto pelo menos 3 encontros com dia, hora e lugar. Print serve.',
              'Pedir dentro de 30 dias da compra, pelo suporte, num e-mail só.',
            ].map((r, i) => (
              <li key={r} className="flex gap-3 text-[13.5px] leading-relaxed">
                <span className="font-mono-d text-[12px] text-[hsl(145_35%_55%)] shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-foreground">{r}</span>
              </li>
            ))}
          </ol>
          <p className="text-[12.5px] text-muted-foreground mt-5 leading-relaxed">
            Cumpriu os quatro e não viu diferença? Devolvo em até 10 dias úteis pelo mesmo meio de
            pagamento, e a parte extra por PIX. Sem interrogatório, sem tentativa de te segurar.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Por que eu topo isso
          </div>
          <p className="text-[13.5px] text-muted-foreground mt-3 leading-relaxed">
            Porque o risco real do meu negócio não é você pedir dinheiro de volta. É você comprar,
            não abrir, e sumir achando que não funciona. A garantia em dobro compra a única coisa
            que eu preciso de você: execução. Quem executa raramente pede reembolso, e quem pede
            merece receber.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dossiery/precos"
            className="inline-block rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] px-8 py-4 hover:opacity-90 transition"
          >
            Ver as faixas de fundador →
          </Link>
        </div>
      </main>
    </div>
  )
}
