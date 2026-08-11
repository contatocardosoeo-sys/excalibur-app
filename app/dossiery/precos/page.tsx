'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import VagasFundador, { useFaixa, type FaixaAPI } from '../components/VagasFundador'
import { DEGRAUS, PRECO_DEPOIS } from '@/app/lib/dossiery/fundador'
import type { Tier } from '@/app/lib/dossiery/stripe'

const BUMP_PRECO = 37

export default function PrecosPage() {
  const [tier, setTier] = useState<Tier>('operador')
  const [bump, setBump] = useState(true)
  const [loading, setLoading] = useState<Tier | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [faixa, setFaixa] = useState<FaixaAPI | null>(null)
  const onFaixa = useCallback((f: FaixaAPI) => setFaixa(f), [])
  useFaixa(onFaixa)

  const precoAnual = faixa?.preco ?? DEGRAUS[0].preco
  const parcela = faixa?.parcela ?? DEGRAUS[0].parcela
  const esgotado = faixa?.esgotado === true

  async function comprar(t: Tier) {
    if (loading) return
    setErro(null)
    setLoading(t)
    const comBump = t !== 'comandante' && bump
    const valor = t === 'comandante' ? 1297 : t === 'recruta' ? 97 : precoAnual
    window.fbq?.('track', 'InitiateCheckout', { value: valor + (comBump ? BUMP_PRECO : 0), currency: 'BRL' })
    window.gtag?.('event', 'begin_checkout', { value: valor, currency: 'BRL' })
    try {
      const res = await fetch('/api/dossiery/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: t, bump: comBump }),
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
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen d-grid-bg">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link href="/dossiery" className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </Link>
          <Link href="/dossiery/entrar" className="text-[13px] text-muted-foreground hover:text-primary transition">
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
            Protocolo Operador · acesso completo
          </div>
          <h1 className="font-serif-d text-4xl md:text-5xl mt-3">Escolha o seu nível.</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-[15px]">
            Em 7 dias você tem conversa viva. Em 30, encontro marcado sem depender de sorte.
          </p>
          <div className="mt-4 text-[12.5px] text-muted-foreground flex justify-center">
            <VagasFundador />
          </div>
        </div>

        {/* order bump: uma vez só, vale pros dois tiers pagos */}
        <button
          type="button"
          onClick={() => setBump((v) => !v)}
          aria-pressed={bump}
          className={`mt-8 mx-auto block w-full max-w-2xl text-left rounded-[5px] border-2 border-dashed p-4 transition ${
            bump ? 'border-[hsl(var(--brass))] bg-[hsl(var(--brass)/0.07)]' : 'border-border hover:border-[hsl(var(--brass)/0.6)]'
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 grid place-items-center w-5 h-5 rounded-[3px] border-2 shrink-0 text-[12px] font-bold ${
                bump ? 'border-[hsl(var(--brass))] bg-[hsl(var(--brass))] text-background' : 'border-muted-foreground/50 text-transparent'
              }`}
            >
              ✓
            </span>
            <div>
              <div className="font-mono-d text-[10px] tracking-[0.14em] uppercase text-[hsl(var(--brass))]">
                Adicione ao Protocolo · +R${BUMP_PRECO}
              </div>
              <div className="font-serif-d text-[15px] mt-1 text-foreground">
                Kit “50 Aberturas Que Não Morrem”
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug">
                As 50 primeiras mensagens que puxam resposta, por situação. Cole, adapte, mande.
                Acesso vitalício. Já vem incluso no Comandante.
              </p>
            </div>
          </div>
        </button>

        {/* três tiers */}
        <div className="mt-6 grid md:grid-cols-3 gap-4 items-start">
          {/* RECRUTA (decoy) */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Recruta</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-serif-d text-4xl">R$97</span>
              <span className="text-muted-foreground text-[13px]">/mês</span>
            </div>
            <div className="mt-1 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
              cancele quando quiser
            </div>
            <ul className="mt-5 space-y-2.5">
              {['Raio-X, Coach e Campo ilimitados', 'Arsenal vendido à parte', 'Preço acompanha o reajuste'].map((b) => (
                <li key={b} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="text-muted-foreground/60">·</span>
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => comprar('recruta')}
              disabled={!!loading}
              className="mt-6 w-full rounded-[4px] border border-border text-[14px] py-3 hover:border-primary hover:text-primary disabled:opacity-50 transition"
            >
              {loading === 'recruta' ? 'Abrindo…' : `Assinar mensal${bump ? ` + Kit · R$${97 + BUMP_PRECO}` : ' · R$97'}`}
            </button>
          </div>

          {/* OPERADOR (o alvo) */}
          <div className="rounded-lg border-2 border-primary bg-card p-6 relative overflow-hidden md:-mt-3 md:pb-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">Operador</div>
              <span className="font-mono-d text-[9px] tracking-[0.14em] uppercase bg-primary text-primary-foreground rounded-[3px] px-2 py-0.5">
                escolha de 8 em 10
              </span>
            </div>
            {esgotado ? (
              <div className="mt-3 text-[14px] text-muted-foreground">
                Degraus esgotados. Só mensal de R${PRECO_DEPOIS}.
              </div>
            ) : (
              <>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-serif-d text-4xl">12x R${parcela}</span>
                </div>
                <div className="mt-1 font-mono-d text-[10px] tracking-widest uppercase text-[hsl(145_35%_55%)]">
                  ou R${precoAnual} à vista no PIX · faixa {faixa?.degrau ?? DEGRAUS[0].nome}
                </div>
              </>
            )}
            <ul className="mt-5 space-y-2.5">
              {[
                'Tudo do Recruta, 12 meses',
                'Kit 50 Aberturas incluso',
                'Protocolo Encontro incluso (34 jogadas)',
                'Preço travado: não sobe enquanto você renovar',
              ].map((b) => (
                <li key={b} className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-snug">
                  <span className="text-primary font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-muted-foreground">
              Valor separado: R$1.348. Você paga R${precoAnual}.
            </p>
            <button
              onClick={() => comprar('operador')}
              disabled={!!loading}
              className="mt-5 w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading === 'operador' ? 'Abrindo checkout…' : `Garantir minha faixa · R$${precoAnual + (bump ? BUMP_PRECO : 0)} →`}
            </button>
            <p className="mt-2.5 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
              PIX ou 12x no cartão
            </p>
          </div>

          {/* COMANDANTE (âncora alta) */}
          <div className="rounded-lg border border-[hsl(var(--brass)/0.6)] bg-card p-6">
            <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">Comandante</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-serif-d text-4xl">R$1.297</span>
            </div>
            <div className="mt-1 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70">
              pagamento único · arsenal vitalício
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                'Tudo do Operador',
                'Perfil Magnético (37 ações)',
                'Protocolo Recomeço (30 jogadas)',
                'Plano 7 Dias completo',
                'Uma call de 45 min comigo, no seu caso',
              ].map((b) => (
                <li key={b} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
                  <span className="text-[hsl(var(--brass))] font-bold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => comprar('comandante')}
              disabled={!!loading}
              className="mt-6 w-full rounded-[4px] border border-[hsl(var(--brass))] text-[hsl(var(--brass))] font-semibold text-[14px] py-3 hover:bg-[hsl(var(--brass)/0.1)] disabled:opacity-50 transition"
            >
              {loading === 'comandante' ? 'Abrindo…' : 'Subir pra Comandante →'}
            </button>
          </div>
        </div>

        {erro && (
          <div className="mt-5 mx-auto max-w-md rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive text-center">
            {erro}
          </div>
        )}

        {/* garantia condicional */}
        <div className="mt-10 mx-auto max-w-2xl rounded-lg border-2 border-[hsl(145_35%_35%)] bg-[hsl(145_35%_20%/0.12)] p-6 text-center">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(145_35%_55%)]">
            Garantia de execução
          </div>
          <p className="font-serif-d text-[22px] mt-2 leading-snug">
            Faça as 7 missões do Plano. Se em 30 dias nenhuma conversa sua mudar,
            <br className="hidden sm:block" /> eu devolvo <span className="text-[hsl(145_35%_55%)]">em dobro</span>.
          </p>
          <p className="text-[13px] text-muted-foreground mt-3 max-w-lg mx-auto">
            Os 7 dias de arrependimento do Código de Defesa do Consumidor continuam valendo, sem
            pergunta nenhuma. A garantia em dobro é a minha aposta em cima disso.{' '}
            <Link href="/dossiery/garantia" className="text-foreground underline underline-offset-4">
              Como funciona
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          <Link href="/dossiery/termos" className="hover:text-[hsl(var(--brass))]">Termos</Link>
          {' · '}
          <Link href="/dossiery/privacidade" className="hover:text-[hsl(var(--brass))]">Privacidade</Link>
          {' · '}
          <Link href="/dossiery/garantia" className="hover:text-[hsl(var(--brass))]">Garantia</Link>
        </p>
      </main>
    </div>
  )
}
