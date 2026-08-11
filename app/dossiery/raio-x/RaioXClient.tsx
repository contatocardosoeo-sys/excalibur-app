'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  PERGUNTAS,
  RESULTADOS,
  calcularResultado,
  type Arq,
} from '@/app/lib/dossiery/raioX'

type Tela = 'intro' | 'quiz' | 'processando' | 'email' | 'resultado'

const PASSOS_ANALISE = [
  'Lendo suas respostas…',
  'Cruzando com 4.000+ conversas reais…',
  'Identificando seu Modo dominante…',
  'Montando o dossiê…',
]

export default function RaioXClient() {
  const [tela, setTela] = useState<Tela>('intro')
  const [idx, setIdx] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [passoAnalise, setPassoAnalise] = useState(0)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const resultado = useRef<{ arq: Arq | 'O'; score: number } | null>(null)

  // animação da tela de análise → gate de e-mail
  useEffect(() => {
    if (tela !== 'processando') return
    if (passoAnalise >= PASSOS_ANALISE.length) {
      const t = setTimeout(() => setTela('email'), 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setPassoAnalise((p) => p + 1), 650)
    return () => clearTimeout(t)
  }, [tela, passoAnalise])

  function iniciar() {
    window.fbq?.('trackCustom', 'QuizStart')
    window.gtag?.('event', 'quiz_start')
    setTela('quiz')
  }

  function responder(opIdx: number) {
    const novas = [...respostas, opIdx]
    setRespostas(novas)
    if (idx + 1 < PERGUNTAS.length) {
      setIdx(idx + 1)
    } else {
      resultado.current = calcularResultado(novas)
      setPassoAnalise(0)
      setTela('processando')
    }
  }

  async function liberarResultado(e: React.FormEvent) {
    e.preventDefault()
    if (enviando) return
    setErro(null)
    if (!consent) {
      setErro('Marca a caixinha pra eu liberar o resultado.')
      return
    }
    setEnviando(true)
    try {
      const r = resultado.current
      const res = await fetch('/api/dossiery/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          arquetipo: r?.arq,
          score: r?.score,
          respostas,
          origem: typeof window !== 'undefined' ? window.location.search.slice(0, 300) : null,
          consent,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
      window.fbq?.('track', 'Lead', undefined, data?.eventId ? { eventID: data.eventId } : undefined)
      window.gtag?.('event', 'generate_lead')
      setTela('resultado')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha inesperada')
    } finally {
      setEnviando(false)
    }
  }

  const r = resultado.current
  const res = r ? RESULTADOS[r.arq] : null

  return (
    <div className="min-h-screen d-grid-bg">
      <header className="border-b border-border/70">
        <div className="mx-auto max-w-xl px-6 h-14 flex items-center justify-between">
          <Link href="/dossiery" className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </Link>
          <span className="font-mono-d text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Raio-X · 2 min
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-10">
        {/* ── INTRO ── */}
        {tela === 'intro' && (
          <div className="text-center">
            <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
              Teste gratuito · 10 cenários · resultado na hora
            </div>
            <h1 className="font-serif-d text-4xl md:text-5xl leading-[1.05] mt-4">
              Qual padrão está <span className="text-primary">matando suas conversas?</span>
            </h1>
            <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
              Vácuo, bolo, “te vejo como amigo” — nada disso é azar. É <span className="text-foreground">padrão</span>.
              10 cenários reais, sem resposta certa óbvia, e no final: seu Índice Modo Trouxa (0-100),
              seu arquétipo dominante e as 3 correções pro SEU caso.
            </p>
            <button
              onClick={iniciar}
              className="mt-8 w-full sm:w-auto rounded-[4px] bg-primary text-primary-foreground font-semibold text-[16px] px-10 py-4 hover:opacity-90 transition"
            >
              Começar o Raio-X →
            </button>
            <p className="mt-4 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
              Anônimo até o resultado · sem resposta certa · sem julgamento
            </p>
          </div>
        )}

        {/* ── QUIZ ── */}
        {tela === 'quiz' && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(idx / PERGUNTAS.length) * 100}%` }}
                />
              </div>
              <span className="font-mono-d text-[11px] text-muted-foreground tabular-nums">
                {idx + 1}/{PERGUNTAS.length}
              </span>
            </div>

            <h2 className="font-serif-d text-2xl md:text-[28px] leading-snug mt-8">
              {PERGUNTAS[idx].q}
            </h2>

            <div className="mt-6 space-y-3">
              {PERGUNTAS[idx].opcoes.map((op, i) => (
                <button
                  key={op.t}
                  onClick={() => responder(i)}
                  className="w-full text-left rounded-md border border-border bg-card px-4 py-3.5 text-[14.5px] leading-snug text-foreground hover:border-primary hover:bg-primary/[0.05] active:scale-[0.99] transition"
                >
                  <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] mr-2.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {op.t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PROCESSANDO ── */}
        {tela === 'processando' && (
          <div className="text-center py-16">
            <div className="mx-auto w-14 h-14 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <div className="mt-8 space-y-2.5">
              {PASSOS_ANALISE.map((p, i) => (
                <p
                  key={p}
                  className={`font-mono-d text-[12px] tracking-wide transition-opacity duration-300 ${
                    i < passoAnalise
                      ? 'text-[hsl(145_35%_55%)]'
                      : i === passoAnalise
                        ? 'text-foreground'
                        : 'text-muted-foreground/30'
                  }`}
                >
                  {i < passoAnalise ? '✓ ' : '· '}
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── GATE DE E-MAIL ── */}
        {tela === 'email' && (
          <div className="text-center">
            <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(145_35%_55%)]">
              ✓ Análise concluída
            </div>
            <h2 className="font-serif-d text-3xl md:text-4xl mt-4 leading-tight">
              Seu dossiê está pronto.
            </h2>
            <p className="text-muted-foreground mt-4 text-[14.5px] max-w-md mx-auto">
              Índice calculado, arquétipo identificado, correções montadas. Diz pra onde mando —
              você vê tudo aqui na tela agora, e recebe a versão completa por e-mail.
            </p>
            <form onSubmit={liberarResultado} className="mt-7 max-w-sm mx-auto text-left">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-[4px] border border-border bg-card px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition"
              />
              <label className="flex items-start gap-2.5 mt-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#B81E33]"
                />
                <span className="text-[12px] text-muted-foreground leading-snug">
                  Topo receber meu resultado e as táticas do Dossiery por e-mail. Zero spam,
                  cancelo quando quiser.{' '}
                  <Link href="/dossiery/privacidade" className="underline underline-offset-2">
                    Privacidade
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                disabled={enviando}
                className="mt-5 w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 disabled:opacity-50 transition"
              >
                {enviando ? 'Liberando…' : 'Ver meu resultado agora →'}
              </button>
              {erro && (
                <div className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive">
                  {erro}
                </div>
              )}
            </form>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {tela === 'resultado' && r && res && (
          <div>
            <div className="text-center">
              <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-muted-foreground">
                Índice Modo Trouxa
              </div>
              <div className="font-serif-d text-7xl mt-2 text-primary tabular-nums">{r.score}</div>
              <div className="font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70 mt-1">
                de 100 · quanto maior, pior
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-primary/50 bg-card p-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
              <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
                Seu arquétipo dominante
              </div>
              <h2 className="font-serif-d text-3xl mt-2">
                {res.nome} <span className="text-muted-foreground text-lg">— {res.tag}</span>
              </h2>
              <p className="text-[14.5px] text-muted-foreground leading-relaxed mt-4">{res.diagnostico}</p>
              <div className="mt-5 rounded-md border border-border bg-secondary/40 p-4">
                <div className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-primary">
                  O que isso te custa
                </div>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-snug">{res.custo}</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
                Suas 3 correções imediatas
              </div>
              <ol className="mt-4 space-y-3.5">
                {res.correcoes.map((c, i) => (
                  <li key={c} className="flex gap-3 text-[14px] leading-snug">
                    <span className="font-mono-d text-[12px] text-primary shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-foreground">{c}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* ponte pro produto */}
            <div className="mt-8 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
              <p className="font-serif-d text-[22px] leading-snug">
                Isso foi o raio-x de <span className="text-primary">10 respostas</span>.
                <br />
                Imagina das suas conversas REAIS.
              </p>
              <p className="text-[13.5px] text-muted-foreground mt-3 max-w-sm mx-auto">
                O Dossiery analisa as SUAS conversas, aponta o seu {res.nome} agindo em tempo real e
                treina você até o padrão morrer. Correção genérica ajuda; correção no seu caso
                resolve.
              </p>
              <Link
                href="/dossiery/precos"
                className="mt-5 block w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-4 hover:opacity-90 transition"
              >
                Matar meu {res.nome} — ver o sistema →
              </Link>
              <Link
                href="/dossiery/criar-conta?next=/dossiery/plano7"
                className="mt-3 block text-[12.5px] text-muted-foreground underline underline-offset-4 hover:text-foreground transition"
              >
                Orçamento apertado? Começa pelo Plano 7 Dias — R$19 →
              </Link>
            </div>

            <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
              Resultado completo + correções enviados pro seu e-mail
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
