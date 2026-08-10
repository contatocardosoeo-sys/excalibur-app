'use client'

import { useEffect, useRef, useState } from 'react'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const SUGESTOES = [
  'Como eu abro conversa com uma mulher que acabei de conhecer?',
  'A conversa sempre morre depois de 3 mensagens. O que estou fazendo de errado?',
  'Como convido pro encontro sem parecer carente?',
  'Levei um fora. Como lido com isso como um homem?',
]

export default function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  async function enviar(texto?: string) {
    const conteudo = (texto ?? input).trim()
    if (!conteudo || loading) return
    setErro(null)
    setInput('')

    const historico: Msg[] = [...msgs, { role: 'user', content: conteudo }]
    setMsgs([...historico, { role: 'assistant', content: '' }])
    setLoading(true)

    try {
      const res = await fetch('/api/dossiery/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historico }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `Erro ${res.status}`)
      }
      if (!res.body) throw new Error('Sem resposta do servidor')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acumulado = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acumulado += decoder.decode(value, { stream: true })
        const parcial = acumulado
        setMsgs([...historico, { role: 'assistant', content: parcial }])
      }
      if (!acumulado.trim()) throw new Error('Resposta vazia — tente de novo')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha inesperada')
      setMsgs(historico) // remove a bolha vazia do assistant
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-8 flex flex-col min-h-screen">
      {/* header */}
      <div className="border-b border-border pb-5">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          02 · O Cérebro
        </div>
        <h1 className="font-serif-d text-3xl mt-1.5">Coach</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Treinado no cânone. Direto, sem passar a mão na cabeça — e sempre com o porquê.
        </p>
      </div>

      {/* thread */}
      <div className="flex-1 py-6 space-y-5">
        {msgs.length === 0 && (
          <div className="rounded-md border border-border bg-card p-6">
            <p className="font-serif-d text-lg">O que está travando o seu jogo?</p>
            <p className="text-[13px] text-muted-foreground mt-1.5">
              Pergunta direta, resposta direta. Alguns pontos de partida:
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-left text-[13px] rounded-[4px] border border-border px-3.5 py-2.5 hover:border-primary/60 hover:text-foreground text-muted-foreground transition"
                >
                  <span className="text-primary mr-2">→</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] rounded-md bg-primary/15 border border-primary/30 px-4 py-3 text-[14px] whitespace-pre-wrap'
                  : 'max-w-[92%] rounded-md bg-card border border-border px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap'
              }
            >
              {m.role === 'assistant' && (
                <div className="font-mono-d text-[9px] tracking-[0.2em] uppercase text-[hsl(var(--brass))] mb-1.5">
                  Coach
                </div>
              )}
              {m.content || (
                <span className="inline-flex gap-1 items-center text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  pensando…
                </span>
              )}
            </div>
          </div>
        ))}

        {erro && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
            {erro}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur pb-6 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            enviar()
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Fala com o Coach…"
            className="flex-1 rounded-[4px] border border-border bg-card px-4 py-3 text-[14px] outline-none focus:border-primary transition placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-[14px] px-5 disabled:opacity-40 hover:opacity-90 transition"
          >
            {loading ? '…' : 'Enviar'}
          </button>
        </form>
        <p className="font-mono-d text-[9px] tracking-widest uppercase text-muted-foreground/60 mt-2 text-center">
          Treina você · nunca fala por você
        </p>
      </div>
    </div>
  )
}
