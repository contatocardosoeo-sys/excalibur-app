'use client'

import Link from 'next/link'
import { useState } from 'react'

const BENEFICIOS = [
  'RAIO-X ilimitado — cola a conversa, vê o Modo Trouxa de fora',
  'TREINO 24/7 — coach de elite no cânone, sempre com o porquê',
  'CAMPO — jogadas na SUA voz, leitura de sinal, fim do bolo surpresa',
  'Zero joguinho: te tornamos o cara de verdade, não um personagem',
  'Arsenal em expansão: Arena de Treino, Diário de Campo e mais',
]

const BUMP_PRECO = 37

export default function PrecosPage() {
  const [ciclo, setCiclo] = useState<'mensal' | 'anual'>('anual')
  const [bump, setBump] = useState(true)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const base = ciclo === 'anual' ? 697 : 97

  async function assinar() {
    if (loading) return
    setErro(null)
    setLoading(true)
    const valor = base + (bump ? BUMP_PRECO : 0)
    window.fbq?.('track', 'InitiateCheckout', { value: valor, currency: 'BRL' })
    window.gtag?.('event', 'begin_checkout', { value: valor, currency: 'BRL' })
    try {
      const res = await fetch('/api/dossiery/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciclo, bump }),
      })
      const data = await res.json().catch(() => null)
      if (res.status === 401) {
        window.location.href = data?.entrar || '/dossiery/criar-conta?next=/dossiery/precos'
        return
      }
      if (!res.ok || !data?.url) throw new Error(data?.error || `Erro ${res.status}`)
      window.location.href = data.url
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha inesperada')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen d-grid-bg">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
          <Link href="/dossiery" className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </Link>
          <Link
            href="/dossiery/entrar"
            className="text-[13px] text-muted-foreground hover:text-primary transition"
          >
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
            Protocolo Operador · acesso completo
          </div>
          <h1 className="font-serif-d text-4xl md:text-5xl mt-3">Um plano. Sem pegadinha.</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-[15px]">
            Raio-X + Treino + Campo, ilimitados. Preço honesto e{' '}
            <span className="text-foreground">7 dias de garantia incondicional</span>.
          </p>
          <p className="mt-3 inline-block rounded-[4px] border border-primary/50 bg-primary/[0.07] px-3 py-1.5 font-mono-d text-[10px] tracking-[0.14em] uppercase text-primary">
            ⚠ Preço de fundador — trava pra sempre nas primeiras vagas
          </p>
        </div>

        {/* toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-[5px] border border-border p-1 bg-card">
            {(['mensal', 'anual'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCiclo(c)}
                className={`px-5 py-2 rounded-[3px] text-[13px] font-medium transition ${
                  ciclo === c
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c === 'mensal' ? 'Mensal' : 'Anual · economize'}
              </button>
            ))}
          </div>
        </div>

        {/* card */}
        <div className="mt-8 mx-auto max-w-md rounded-lg border border-primary/50 bg-card p-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            Plano Operador
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            {ciclo === 'mensal' ? (
              <>
                <span className="font-serif-d text-5xl">R$97</span>
                <span className="text-muted-foreground text-[14px]">/mês</span>
              </>
            ) : (
              <>
                <span className="font-serif-d text-5xl">R$58</span>
                <span className="text-muted-foreground text-[14px]">/mês · R$697/ano</span>
              </>
            )}
          </div>
          {ciclo === 'anual' ? (
            <div className="mt-1 font-mono-d text-[10px] tracking-widest uppercase text-[hsl(145_35%_55%)]">
              ≈ 40% off · pagamento único à vista (PIX ou cartão)
            </div>
          ) : (
            <div className="mt-1 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
              assinatura no cartão · cancele quando quiser
            </div>
          )}

          <ul className="mt-6 space-y-3">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-snug">
                <span className="text-primary font-bold">✓</span>
                {b}
              </li>
            ))}
          </ul>

          {/* order bump */}
          <button
            type="button"
            onClick={() => setBump((v) => !v)}
            aria-pressed={bump}
            className={`mt-6 w-full text-left rounded-[5px] border-2 border-dashed p-4 transition ${
              bump
                ? 'border-[hsl(var(--brass))] bg-[hsl(var(--brass)/0.07)]'
                : 'border-border hover:border-[hsl(var(--brass)/0.6)]'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid place-items-center w-5 h-5 rounded-[3px] border-2 shrink-0 text-[12px] font-bold ${
                  bump
                    ? 'border-[hsl(var(--brass))] bg-[hsl(var(--brass))] text-background'
                    : 'border-muted-foreground/50 text-transparent'
                }`}
              >
                ✓
              </span>
              <div>
                <div className="font-mono-d text-[10px] tracking-[0.14em] uppercase text-[hsl(var(--brass))]">
                  Adicione ao Protocolo · +R$37
                </div>
                <div className="font-serif-d text-[15px] mt-1 text-foreground">
                  Kit “50 Aberturas Que Não Morrem”
                </div>
                <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug">
                  As 50 primeiras mensagens testadas que puxam resposta — por situação (match novo,
                  ela sumiu, reconquista). Cole, adapte na sua voz, mande. Acesso vitalício.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={assinar}
            disabled={loading}
            className="mt-6 w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading
              ? 'Abrindo checkout…'
              : `${ciclo === 'anual' ? 'Garantir acesso' : 'Assinar agora'} — R$${base + (bump ? BUMP_PRECO : 0)} →`}
          </button>
          <p className="mt-3 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
            Garantia de 7 dias · {ciclo === 'anual' ? 'PIX ou cartão' : 'cancele em 2 cliques'}
          </p>
          {erro && (
            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive">
              {erro}
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-[12.5px] text-muted-foreground max-w-md mx-auto">
          Pagamento seguro via Stripe. Não curtiu em 7 dias? Devolvemos tudo, sem perguntas — é só
          pedir pelo portal ou suporte.
        </p>
        <p className="mt-4 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          <Link href="/dossiery/termos" className="hover:text-[hsl(var(--brass))]">Termos</Link>
          {' · '}
          <Link href="/dossiery/privacidade" className="hover:text-[hsl(var(--brass))]">Privacidade</Link>
        </p>
      </main>
    </div>
  )
}
