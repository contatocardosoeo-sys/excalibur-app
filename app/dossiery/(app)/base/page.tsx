import Link from 'next/link'

const stats = [
  { v: '—', l: 'Evolução geral', s: 'aguardando 1ª sessão' },
  { v: '0', l: 'Streak (dias)', s: 'comece hoje' },
  { v: '0', l: 'Conexões ativas', s: 'seu CRM pessoal' },
  { v: '0', l: 'Reps de campo', s: 'interações reais' },
]

const atalhos = [
  { href: '/dossiery/coach', n: '02', t: 'Falar com o Coach', d: 'tire uma dúvida, treine uma ideia' },
  { href: '/dossiery/analisar', n: '03', t: 'Analisar conversa', d: 'cola o print, recebe o diagnóstico' },
  { href: '/dossiery/arena', n: '04', t: 'Entrar na Arena', d: 'roleplay com feedback por mensagem' },
]

export default function BasePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 md:px-10 py-10">
      {/* header */}
      <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
            01 · Command Center
          </div>
          <h1 className="font-serif-d text-4xl mt-2">Base</h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="font-mono-d text-[11px] tracking-widest uppercase text-muted-foreground">Operador</div>
          <div className="font-serif-d text-lg">Bem-vindo de volta</div>
        </div>
      </div>

      {/* missão do dia */}
      <div className="mt-8 rounded-md border border-primary/40 bg-primary/[0.06] p-6 relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-1 bg-primary" />
        <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-primary">Missão do dia</div>
        <p className="font-serif-d text-2xl mt-2 max-w-xl">
          Complete seu mapeamento de atleta pra IA te calibrar de verdade.
        </p>
        <p className="text-[14px] text-muted-foreground mt-2 max-w-lg">
          Objetivo, arquétipo, forças e travas. Leva 3 minutos e destrava feedback personalizado em todo o sistema.
        </p>
        <Link
          href="/dossiery/conta"
          className="inline-block mt-4 rounded-[4px] bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-2 hover:opacity-90 transition"
        >
          Mapear agora →
        </Link>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.l} className="rounded-md border border-border bg-card p-4">
            <div className="font-serif-d text-3xl tabular-nums">{s.v}</div>
            <div className="text-[13px] text-foreground mt-1">{s.l}</div>
            <div className="font-mono-d text-[10px] tracking-wide uppercase text-muted-foreground mt-1">{s.s}</div>
          </div>
        ))}
      </div>

      {/* two columns */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        {/* insight da IA */}
        <div className="rounded-md border border-border bg-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
            <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Insight da IA
            </span>
          </div>
          <p className="font-serif-d text-lg mt-4 leading-snug">
            "Atração é emocional, não lógica. Não-carência não é frieza — é ter a própria vida cheia."
          </p>
          <p className="text-[13px] text-muted-foreground mt-3">
            — princípio do cânone (Models · SDT). Assim que você usar o Coach e a Arena, os insights viram feedback
            sobre <span className="text-foreground">os seus</span> padrões.
          </p>
        </div>

        {/* últimas conexões */}
        <div className="rounded-md border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
              <span className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Últimas conexões
              </span>
            </div>
            <Link href="/dossiery/conexoes" className="text-[12px] text-primary hover:underline">
              ver todas
            </Link>
          </div>
          <div className="mt-6 grid place-items-center text-center py-6">
            <div className="font-serif-d text-4xl text-muted-foreground/40">∅</div>
            <p className="text-[13px] text-muted-foreground mt-3 max-w-[24ch]">
              Nenhuma conexão ainda. Seu CRM pessoal começa vazio — e privado.
            </p>
          </div>
        </div>
      </div>

      {/* atalhos */}
      <div className="mt-6">
        <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Ações rápidas
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {atalhos.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-md border border-border bg-card p-5 hover:border-primary/60 transition"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono-d text-[11px] text-[hsl(var(--brass))]">{a.n}</span>
                <span className="font-serif-d text-lg group-hover:text-primary transition">{a.t}</span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-2">{a.d}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
