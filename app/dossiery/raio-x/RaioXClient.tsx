'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PERGUNTAS, RESULTADOS, calcularResultado, type Arq } from '@/app/lib/dossiery/raioX'
import { alternarSom, carregarPreferencia, somLigado, tocar, vibrar } from '@/app/lib/dossiery/quizFx'

type Tela = 'intro' | 'quiz' | 'processando' | 'email' | 'resultado'

const PASSOS_ANALISE = [
  'Lendo suas respostas…',
  'Cruzando com os padrões do cânone…',
  'Isolando seu Modo dominante…',
  'Montando o dossiê…',
]

// Micro-feedback por pergunta: o cara sente que está avançando.
const RITMO = ['', 'boa', 'seguindo', 'no ritmo', 'metade', 'passou da metade', 'firme', 'quase lá', 'reta final', 'última']

const CHAVE_PROGRESSO = 'dossiery_raiox'

export default function RaioXClient() {
  const [tela, setTela] = useState<Tela>('intro')
  const [idx, setIdx] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [escolhida, setEscolhida] = useState<number | null>(null)
  const [passoAnalise, setPassoAnalise] = useState(0)
  const [email, setEmail] = useState('')
  const [zap, setZap] = useState('')
  const [consent, setConsent] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [comprando, setComprando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [som, setSom] = useState(true)
  const [placar, setPlacar] = useState(0)
  const resultado = useRef<{ arq: Arq | 'O'; score: number } | null>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  // Preferência de som + progresso salvo (refresh não perde o teste)
  useEffect(() => {
    carregarPreferencia()
    setSom(somLigado())
    try {
      const cru = localStorage.getItem(CHAVE_PROGRESSO)
      if (cru) {
        const p = JSON.parse(cru)
        if (Array.isArray(p?.respostas) && p.respostas.length > 0 && p.respostas.length < PERGUNTAS.length) {
          setRespostas(p.respostas)
          setIdx(p.respostas.length)
          setTela('quiz')
        }
      }
    } catch {
      /* sem progresso salvo */
    }
  }, [])

  // Foco no enunciado a cada pergunta: leitor de tela acompanha e o teclado
  // volta pro lugar certo (nada de foco preso no botão anterior).
  useEffect(() => {
    if (tela === 'quiz') tituloRef.current?.focus()
  }, [tela, idx])

  useEffect(() => {
    if (tela !== 'processando') return
    if (passoAnalise >= PASSOS_ANALISE.length) {
      const t = setTimeout(() => {
        tocar('lock')
        setTela('email')
      }, 320)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      tocar('lock')
      setPassoAnalise((p) => p + 1)
    }, 620)
    return () => clearTimeout(t)
  }, [tela, passoAnalise])

  // Contagem animada do índice na revelação
  useEffect(() => {
    if (tela !== 'resultado' || !resultado.current) return
    const alvo = resultado.current.score
    let atual = 0
    const passo = Math.max(1, Math.round(alvo / 28))
    const t = setInterval(() => {
      atual = Math.min(alvo, atual + passo)
      setPlacar(atual)
      if (atual >= alvo) clearInterval(t)
    }, 26)
    return () => clearInterval(t)
  }, [tela])

  const responder = useCallback(
    (opIdx: number) => {
      if (escolhida !== null) return // evita duplo toque
      setEscolhida(opIdx)
      tocar('select')
      vibrar(12)

      // Confirma visualmente e só então vira a página
      setTimeout(() => {
        const novas = [...respostas, opIdx]
        setRespostas(novas)
        setEscolhida(null)
        try {
          localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify({ respostas: novas }))
        } catch {
          /* modo privado */
        }
        if (idx + 1 < PERGUNTAS.length) {
          tocar('next')
          setIdx(idx + 1)
        } else {
          resultado.current = calcularResultado(novas)
          setPassoAnalise(0)
          setTela('processando')
          try {
            localStorage.removeItem(CHAVE_PROGRESSO)
          } catch {
            /* ok */
          }
        }
      }, 190)
    },
    [escolhida, idx, respostas]
  )

  function voltar() {
    if (idx === 0 || escolhida !== null) return
    tocar('select')
    setRespostas((r) => r.slice(0, -1))
    setIdx((i) => i - 1)
  }

  // Teclado: 1-4 ou A-D respondem, Backspace volta. Desktop fica rápido.
  useEffect(() => {
    if (tela !== 'quiz') return
    function onKey(e: KeyboardEvent) {
      const n = PERGUNTAS[idx].opcoes.length
      const k = e.key.toLowerCase()
      const porNumero = parseInt(k, 10)
      const porLetra = 'abcd'.indexOf(k)
      if (porNumero >= 1 && porNumero <= n) {
        e.preventDefault()
        responder(porNumero - 1)
      } else if (porLetra >= 0 && porLetra < n) {
        e.preventDefault()
        responder(porLetra)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        voltar()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function iniciar() {
    tocar('next')
    vibrar(14)
    window.fbq?.('trackCustom', 'QuizStart')
    window.gtag?.('event', 'quiz_start')
    setTela('quiz')
  }

  async function liberarResultado(e: React.FormEvent) {
    e.preventDefault()
    if (enviando) return
    setErro(null)
    if (!consent) {
      tocar('erro')
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
          whatsapp: zap,
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
      tocar('reveal')
      vibrar([18, 60, 26])
      setTela('resultado')
    } catch (err) {
      tocar('erro')
      setErro(err instanceof Error ? err.message : 'Falha inesperada')
    } finally {
      setEnviando(false)
    }
  }

  const r = resultado.current
  const res = r ? RESULTADOS[r.arq] : null
  const pergunta = PERGUNTAS[idx]

  return (
    <div className="min-h-screen d-grid-bg">
      <header className="border-b border-border/70 sticky top-0 z-30 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-xl px-6 h-14 flex items-center justify-between">
          <Link href="/dossiery" className="flex items-center gap-2 h-11 -ml-1 px-1">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono-d text-[10px] tracking-[0.2em] uppercase text-muted-foreground hidden sm:inline">
              Raio-X · 2 min
            </span>
            <button
              onClick={() => setSom(alternarSom())}
              aria-label={som ? 'Desligar som' : 'Ligar som'}
              title={som ? 'Som ligado' : 'Som desligado'}
              className="grid place-items-center w-11 h-11 -mr-2 rounded-[4px] text-muted-foreground hover:text-foreground active:scale-95 transition text-[15px]"
            >
              {som ? '♪' : '✕'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-10 pb-24">
        {/* h1 constante da página: as telas internas usam h2 */}
        {tela !== 'intro' && <h1 className="sr-only">Raio-X: qual é o seu Modo?</h1>}
        {/* ── INTRO ── */}
        {tela === 'intro' && (
          <div className="text-center d-quiz-in">
            <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
              Grátis · 10 cenários · resultado na hora
            </div>
            <h1 className="font-serif-d text-4xl md:text-5xl leading-[1.05] mt-4 text-balance">
              Qual padrão tá <span className="text-primary">matando suas conversas?</span>
            </h1>
            <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
              O vácuo se repete porque o padrão é seu. Responde 10 cenários e sai com seu Índice
              Modo Trouxa, o arquétipo dominante e 3 correções.
            </p>
            <button
              onClick={iniciar}
              className="mt-8 w-full sm:w-auto rounded-[4px] bg-primary text-primary-foreground font-semibold text-[16px] px-10 py-4 hover:opacity-90 active:scale-[0.99] transition"
            >
              Começar o Raio-X →
            </button>
            <p className="mt-4 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
              Anônimo · sem resposta certa · 2 minutos
            </p>
          </div>
        )}

        {/* ── QUIZ ── */}
        {tela === 'quiz' && (
          <div>
            {/* progresso em fichas */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={PERGUNTAS.length} aria-label="Progresso do Raio-X">
                {PERGUNTAS.map((_, i) => (
                  <span key={i} className="d-seg" data-on={i < idx ? '1' : '0'} data-now={i === idx ? '1' : '0'}>
                    <i />
                  </span>
                ))}
              </div>
              <span className="font-mono-d text-[11px] text-muted-foreground tabular-nums shrink-0">
                {idx + 1}/{PERGUNTAS.length}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 min-h-[44px]">
              <span className="font-mono-d text-[10px] tracking-[0.16em] uppercase text-[hsl(var(--brass))]">
                {RITMO[idx]}
              </span>
              {idx > 0 && (
                <button
                  onClick={voltar}
                  className="d-toque -mr-1 font-mono-d text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70 hover:text-foreground transition"
                >
                  ← voltar
                </button>
              )}
            </div>

            {/* a pergunta remonta a cada índice: nada de estado preso do botão anterior */}
            <div key={idx} className="d-quiz-in d-quiz-corpo">
              <h2
                ref={tituloRef}
                tabIndex={-1}
                className="font-serif-d text-2xl md:text-[28px] leading-snug outline-none text-balance"
              >
                {pergunta.q}
              </h2>

              <div className="mt-6 flex flex-col gap-3">
                {pergunta.opcoes.map((op, i) => (
                  <button
                    key={`${idx}-${i}`}
                    type="button"
                    data-sel={escolhida === i ? '1' : '0'}
                    disabled={escolhida !== null}
                    onPointerUp={(e) => e.currentTarget.blur()}
                    onClick={() => responder(i)}
                    className="d-opt"
                  >
                    <span className="d-opt-letra font-mono-d text-[hsl(var(--brass))]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="d-opt-txt">{op.t}</span>
                  </button>
                ))}
              </div>

              {/* quanto falta: quiz que mostra o fim tem menos abandono */}
              <p className="mt-7 text-center font-mono-d text-[10px] tracking-[0.08em] uppercase text-muted-foreground/45">
                {PERGUNTAS.length - idx === 1
                  ? 'último cenário · seu dossiê sai a seguir'
                  : `faltam ${PERGUNTAS.length - idx - 1} cenários · cerca de ${Math.max(1, Math.round((PERGUNTAS.length - idx - 1) * 11 / 60))} min`}
                <span className="hidden sm:inline"> · teclado A a D</span>
              </p>
            </div>
          </div>
        )}

        {/* ── PROCESSANDO ── */}
        {tela === 'processando' && (
          <div className="text-center py-16 d-quiz-in" aria-live="polite">
            <div className="mx-auto w-14 h-14 rounded-full border-2 border-primary border-t-transparent animate-spin motion-reduce:animate-none" />
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

        {/* ── GATE: o dossiê aparece borrado, o e-mail abre ── */}
        {tela === 'email' && r && res && (
          <div className="text-center d-quiz-in">
            <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(145_35%_55%)]">
              ✓ Análise concluída
            </div>
            <h2 className="font-serif-d text-3xl md:text-4xl mt-3 leading-tight">
              Seu dossiê tá pronto.
            </h2>

            {/* teaser real: o resultado existe, só está lacrado */}
            <div className="mt-6 rounded-lg border border-[hsl(var(--brass)/0.4)] bg-card text-left overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-[hsl(var(--brass)/0.25)] bg-[hsl(var(--brass)/0.07)] px-5 py-2.5">
                <span className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                  Dossiê #{r.score % 97 + 3}
                </span>
                <span className="font-mono-d text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
                  lacrado
                </span>
              </div>
              <div className="px-5 py-5">
              <div className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                Índice Modo Trouxa
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-serif-d text-4xl text-primary select-none blur-[7px]" aria-hidden>
                  {r.score}
                </span>
                <span className="font-mono-d text-[11px] uppercase tracking-widest text-muted-foreground">
                  de 100
                </span>
              </div>
              <div className="mt-3 font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                Arquétipo dominante
              </div>
              <div className="font-serif-d text-2xl select-none blur-[7px] pb-1" aria-hidden>
                {res.nome}
              </div>
              <div className="mt-4 pt-3 border-t border-border font-mono-d text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                3 correções prontas · esperando o seu e-mail
              </div>
              </div>
            </div>

            <p className="text-muted-foreground mt-5 text-[14px]">
              Diz pra onde mando e ele abre agora, aqui na tela.
            </p>

            <form onSubmit={liberarResultado} className="mt-5 max-w-sm mx-auto text-left">
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-[4px] border border-border bg-card px-4 py-3.5 text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition"
              />
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={zap}
                onChange={(e) => setZap(e.target.value)}
                placeholder="WhatsApp com DDD (opcional)"
                className="mt-3 w-full rounded-[4px] border border-border bg-card px-4 py-3.5 text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition"
              />
              <label className="flex items-start gap-3 mt-3 py-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-px w-6 h-6 shrink-0 accent-[#B81E33]"
                />
                <span className="text-[12.5px] text-muted-foreground leading-snug">
                  Quero receber meu resultado e as táticas do Dossiery por e-mail ou WhatsApp. Zero
                  spam, cancelo quando quiser.{' '}
                  <Link href="/dossiery/privacidade" className="d-toque underline underline-offset-2">
                    Privacidade
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                disabled={enviando}
                className="mt-5 w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-4 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 transition"
              >
                {enviando ? 'Abrindo…' : 'Abrir meu dossiê →'}
              </button>
              {erro && (
                <div role="alert" className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive">
                  {erro}
                </div>
              )}
              <p className="mt-3.5 text-center text-[12.5px] text-muted-foreground/70 leading-snug">
                Abre nesta tela, na hora. Sem espera e sem confirmação de e-mail.
              </p>
            </form>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {tela === 'resultado' && r && res && (
          <div className="d-quiz-in">
            <div className="text-center">
              <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-muted-foreground">
                Índice Modo Trouxa
              </div>
              {/* medidor: número + arco, porque número sozinho não dói */}
              <div className="relative w-[184px] h-[104px] mx-auto mt-3">
                <svg viewBox="0 0 184 104" className="w-full h-full" aria-hidden>
                  <path d="M12 100 A80 80 0 0 1 172 100" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" strokeLinecap="round" />
                  <path
                    d="M12 100 A80 80 0 0 1 172 100"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="251"
                    strokeDashoffset={251 - (251 * placar) / 100}
                    style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.2,.8,.3,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="font-serif-d text-6xl text-primary tabular-nums">{placar}</span>
                </div>
              </div>
              <div className="font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/70 -mt-1">
                de 100 · quanto maior, pior
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-primary/50 bg-card p-6 relative overflow-hidden d-pop">
              <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
              <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
                Seu arquétipo dominante
              </div>
              <h2 className="font-serif-d text-3xl mt-2">
                {res.nome} <span className="text-muted-foreground text-lg">· {res.tag}</span>
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

            <div className="mt-8 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
              <p className="font-serif-d text-[22px] leading-snug">
                Isso foi o raio-x de <span className="text-primary">10 respostas</span>.
                <br />
                Imagina das suas conversas REAIS.
              </p>
              <p className="text-[13.5px] text-muted-foreground mt-3 max-w-sm mx-auto">
                O Plano 7 Dias mata seu {res.nome} em uma semana. Uma missão por dia, 40 passos,
                menos de 30 minutos por dia.
              </p>
              {/* Compra direta, sem conta antes: o e-mail do quiz pré-preenche o
                  Stripe e a conta nasce no webhook. Se a API falhar, cai na rota
                  antiga (conta → plano7) — o clique nunca morre. */}
              <button
                onClick={async () => {
                  if (comprando) return
                  setComprando(true)
                  window.fbq?.('track', 'InitiateCheckout', { value: 19, currency: 'BRL' })
                  window.gtag?.('event', 'begin_checkout', { value: 19, currency: 'BRL' })
                  try {
                    const resp = await fetch('/api/dossiery/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ produto: 'plano7', email }),
                    })
                    const data = await resp.json().catch(() => null)
                    if (!resp.ok || !data?.url) throw new Error(data?.error || `Erro ${resp.status}`)
                    window.location.href = data.url
                  } catch {
                    window.location.href = '/dossiery/criar-conta?next=/dossiery/plano7'
                  }
                }}
                disabled={comprando}
                className="mt-5 block w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-4 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 transition"
              >
                {comprando ? 'Abrindo pagamento…' : 'Começar por R$19: Plano 7 Dias →'}
              </button>
              <Link
                href="/dossiery/precos"
                className="mt-3 block text-[12.5px] text-muted-foreground underline underline-offset-4 hover:text-foreground transition"
              >
                Quero o acesso completo: ver o sistema →
              </Link>
            </div>

            <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
              Resultado completo enviado pro seu e-mail
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
