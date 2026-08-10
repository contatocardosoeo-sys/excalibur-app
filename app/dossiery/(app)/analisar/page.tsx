'use client'

import { useState } from 'react'

interface Resultado {
  leitura_dela: string
  diagnostico: Array<{ tipo: 'acerto' | 'erro' | 'alerta'; ponto: string }>
  sugestoes: Array<{ texto: string; porque: string }>
}

const ICON: Record<string, { mark: string; cls: string }> = {
  acerto: { mark: '✓', cls: 'text-[hsl(145_40%_55%)]' },
  erro: { mark: '✕', cls: 'text-destructive' },
  alerta: { mark: '!', cls: 'text-[hsl(40_60%_55%)]' },
}

export default function AnalisarPage() {
  const [conversa, setConversa] = useState('')
  const [contexto, setContexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [copiado, setCopiado] = useState<number | null>(null)

  async function analisar() {
    if (loading || conversa.trim().length < 20) return
    setErro(null)
    setResultado(null)
    setLoading(true)
    try {
      const res = await fetch('/api/dossiery/analisar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversa, contexto }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`)
      setResultado(data.resultado as Resultado)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha inesperada')
    } finally {
      setLoading(false)
    }
  }

  async function copiar(texto: string, i: number) {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(i)
      setTimeout(() => setCopiado(null), 1500)
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-8">
      <div className="border-b border-border pb-5">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          03 · Diagnóstico
        </div>
        <h1 className="font-serif-d text-3xl mt-1.5">Analisar conversa</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Cola a conversa. Recebe a leitura dela, o raio-X do seu jogo e 2-3 respostas na sua voz —
          pra você editar e mandar. Nunca mandamos nada por você.
        </p>
      </div>

      {/* form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            A conversa (cole como está no app)
          </label>
          <textarea
            value={conversa}
            onChange={(e) => setConversa(e.target.value)}
            rows={9}
            placeholder={'Eu: oi, curti demais seu perfil...\nEla: ahh obrigada hahah\nEu: ...'}
            className="mt-2 w-full rounded-[4px] border border-border bg-card px-4 py-3 text-[14px] outline-none focus:border-primary transition placeholder:text-muted-foreground/50 resize-y"
          />
        </div>
        <div>
          <label className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
            Contexto (opcional)
          </label>
          <input
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Ex.: match no Tinder há 3 dias, ela demora pra responder…"
            className="mt-2 w-full rounded-[4px] border border-border bg-card px-4 py-3 text-[14px] outline-none focus:border-primary transition placeholder:text-muted-foreground/50"
          />
        </div>
        <button
          onClick={analisar}
          disabled={loading || conversa.trim().length < 20}
          className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-[14px] px-6 py-3 disabled:opacity-40 hover:opacity-90 transition"
        >
          {loading ? 'Analisando…' : 'Analisar →'}
        </button>
        {erro && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
            {erro}
          </div>
        )}
      </div>

      {/* resultado */}
      {resultado && (
        <div className="mt-8 space-y-5">
          <div className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
              <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Leitura dela
              </span>
            </div>
            <p className="text-[14px] leading-relaxed">{resultado.leitura_dela}</p>
          </div>

          <div className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
              <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Raio-X do seu jogo
              </span>
            </div>
            <ul className="space-y-2.5">
              {resultado.diagnostico.map((d, i) => {
                const ic = ICON[d.tipo] ?? ICON.alerta
                return (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed">
                    <span className={`font-bold ${ic.cls}`}>{ic.mark}</span>
                    <span className="text-muted-foreground">{d.ponto}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="rounded-md border border-primary/40 bg-primary/[0.05] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2 h-2 rotate-45 bg-primary" />
              <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-primary">
                Suas próximas jogadas — edite do seu jeito
              </span>
            </div>
            <div className="space-y-4">
              {resultado.sugestoes.map((s, i) => (
                <div key={i} className="rounded-[4px] border border-border bg-background p-4">
                  <p className="text-[14px] leading-relaxed">{s.texto}</p>
                  <p className="text-[12px] text-muted-foreground mt-2">
                    <span className="font-mono-d text-[9px] tracking-widest uppercase text-[hsl(var(--brass))] mr-2">
                      Porquê
                    </span>
                    {s.porque}
                  </p>
                  <button
                    onClick={() => copiar(s.texto, i)}
                    className="mt-3 rounded-[3px] border border-border font-mono-d text-[10px] tracking-widest uppercase px-2.5 py-1.5 text-muted-foreground hover:border-primary hover:text-primary transition"
                  >
                    {copiado === i ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
            <p className="font-mono-d text-[9px] tracking-widest uppercase text-muted-foreground/60 mt-4">
              Sugestão é ponto de partida — a voz final é sua.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
