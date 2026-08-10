import Link from 'next/link'

const principios = [
  {
    n: '01',
    titulo: 'Treina o atleta',
    corpo: 'Feedback por mensagem, roleplay, currículo real. Você melhora — não vira refém de um gerador de frase pronta.',
  },
  {
    n: '02',
    titulo: 'Voz própria, não impersonation',
    corpo: 'A IA te ajuda a dizer a sua coisa melhor. Nunca escreve fingindo ser você. Anti-"chatfishing".',
  },
  {
    n: '03',
    titulo: 'Transfere pra vida real',
    corpo: 'Projetado pro momento em que a rodinha sai da bicicleta. A meta é você não precisar mais do app.',
  },
]

const stats = [
  { v: '7,5M+', l: 'downloads do líder da categoria (Rizz)' },
  { v: '~$500K', l: 'faturamento/mês estimado — bootstrapped' },
  { v: '+333%', l: 'alta anual de solteiros usando IA no dating' },
  { v: '6 em 10', l: 'usuárias já suspeitam de texto escrito por IA' },
]

const modulos = [
  { n: '02', t: 'Coach', d: 'IA treinada no cânone. Responde com o "porquê", não só com a linha.' },
  { n: '03', t: 'Analisar', d: 'Cola a conversa → diagnóstico e 2-3 respostas suas pra editar.' },
  { n: '04', t: 'Arena', d: 'Roleplay com cenários e heat-map. É aqui que a habilidade é forjada.' },
  { n: '06', t: 'Campo', d: 'Registrou a interação real? A IA faz o debrief e marca a próxima rep.' },
  { n: '07', t: 'Academia', d: 'A biblioteca do cânone: trilhas, princípios, drills práticos.' },
  { n: '08', t: 'Evolução', d: 'Skill tree e XP. Gamifica o único KPI que importa: você melhorando.' },
]

export default function DossieryLanding() {
  return (
    <div className="relative overflow-hidden">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </div>
          <div className="hidden sm:block font-mono-d text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Dossiê Nº 001 · Projeto Conquista
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dossiery/precos"
              className="text-[13px] text-muted-foreground hover:text-primary transition"
            >
              Preços
            </Link>
            <Link
              href="/dossiery/entrar"
              className="text-[13px] font-medium rounded-[4px] border border-border px-3.5 py-1.5 hover:border-primary hover:text-primary transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative border-b border-border">
        <div className="d-grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          {/* seal + stamp */}
          <div className="pointer-events-none absolute right-6 top-16 hidden md:block">
            <div className="relative grid place-items-center w-28 h-28 rounded-full border border-[hsl(var(--brass))] text-[hsl(var(--brass))]">
              <span className="absolute inset-[9px] rounded-full border border-dashed border-[hsl(var(--brass)/0.5)]" />
              <span className="font-serif-d text-4xl">D</span>
            </div>
            <div className="absolute -bottom-3 -left-6 rotate-[-9deg] rounded-[3px] border-2 border-primary text-primary/90 font-mono-d font-bold tracking-[0.16em] text-[10px] uppercase px-2 py-1">
              Confidencial
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
            <span className="w-7 h-px bg-primary inline-block" />
            Plano Mestre · v1.0
          </div>
          <h1 className="font-serif-d font-semibold leading-[0.95] tracking-tight text-6xl md:text-8xl mt-5">
            Dossiery
          </h1>
          <p className="font-serif-d italic text-2xl md:text-3xl text-muted-foreground mt-4 max-w-2xl">
            O sistema operacional do homem que conquista.
          </p>
          <p className="text-[15px] md:text-base text-muted-foreground/90 mt-6 max-w-xl leading-relaxed">
            Não é mais uma máquina de frase pronta. É um sistema de treino: mapeia{' '}
            <span className="text-foreground font-medium">você</span>, corrige sua comunicação com feedback
            brutal, e te transforma no cara que dispensa muleta. A métrica de sucesso é a{' '}
            <span className="text-foreground font-medium">sua</span> evolução — não quantas linhas prontas você consumiu.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/dossiery/precos"
              className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 hover:opacity-90 transition"
            >
              Entrar no jogo →
            </Link>
            <a
              href="#principios"
              className="rounded-[4px] border border-border text-sm px-5 py-2.5 hover:border-primary hover:text-primary transition"
            >
              O manifesto
            </a>
          </div>

          <div className="mt-10 inline-block font-serif-d text-xl md:text-2xl border-b-2 border-primary pb-1">
            O dossiê é sobre você.
          </div>
        </div>
      </section>

      {/* princípios */}
      <section id="principios" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            A diferença
          </div>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-2 max-w-2xl">
            Vender competência, não dependência.
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-9">
            {principios.map((p) => (
              <div
                key={p.n}
                className="rounded-md border border-border bg-card p-6 hover:border-[hsl(var(--brass)/0.6)] transition"
              >
                <div className="font-mono-d text-[11px] text-primary tracking-widest">{p.n}</div>
                <h3 className="font-serif-d text-xl mt-3">{p.titulo}</h3>
                <p className="text-[14px] text-muted-foreground mt-2 leading-relaxed">{p.corpo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* mercado */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Inteligência de mercado · 2025–2026
          </div>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-2 max-w-3xl">
            A categoria é gorda — e todo concorrente comete o mesmo erro.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-9">
            {stats.map((s) => (
              <div key={s.l} className="rounded border border-border border-l-2 border-l-primary bg-background p-4">
                <div className="font-serif-d text-3xl tabular-nums">{s.v}</div>
                <div className="text-[12px] text-muted-foreground mt-2 leading-snug">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="text-[14px] text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            Máquinas de linha pronta soam robóticas, geram o <span className="text-foreground">"ick"</span> e deixam o
            cara <span className="text-foreground">travado no encontro sem a IA</span>. O único resultado que um clone de
            GPT não copia é o homem ficar genuinamente melhor. Até o Hinge já foi pra esse lado — coaching que
            deliberadamente <span className="text-foreground">não</span> gera script pronto.
          </p>
        </div>
      </section>

      {/* módulos */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            O arsenal
          </div>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-2">Os módulos.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-9">
            {modulos.map((m) => (
              <div key={m.n} className="group rounded-md border border-border bg-card p-5 hover:border-primary/60 transition">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-d text-[11px] text-[hsl(var(--brass))]">{m.n}</span>
                  <span className="font-serif-d text-lg">{m.t}</span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* carta de princípios */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            Integridade = fosso competitivo
          </div>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-2">Carta de princípios.</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-9">
            <div className="rounded-md border border-border border-t-2 border-t-[hsl(145_30%_45%)] bg-card p-6">
              <h3 className="font-mono-d text-[12px] tracking-[0.16em] uppercase text-[hsl(145_35%_55%)]">
                O que o Dossiery faz
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] text-muted-foreground">
                {[
                  'Coacha você: confiança, calibração, escuta, presença.',
                  'Analisa as suas conversas e te dá feedback direto.',
                  'Ensina a ler interesse e desinteresse — e a sair com classe.',
                  'Trata rejeição como informação de baixo custo, não fracasso.',
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-[hsl(145_40%_55%)] font-bold">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border border-t-2 border-t-destructive bg-card p-6">
              <h3 className="font-mono-d text-[12px] tracking-[0.16em] uppercase text-destructive">
                O que nunca faz
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] text-muted-foreground">
                {[
                  'Vigiar, raspar ou montar dossiê de exploração de alguém.',
                  'Responder story/DM no automático se passando por você.',
                  'Gerar tática pra "vencer um não" ou insistir.',
                  'Negging, love-bombing, escassez falsa, PUA.',
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-destructive font-bold">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-serif-d text-4xl md:text-5xl">Vira o cara.</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Sem muleta. Sem enganação. Só você — melhor, calibrado, no controle do jogo.
          </p>
          <Link
            href="/dossiery/precos"
            className="inline-block mt-8 rounded-[4px] bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 hover:opacity-90 transition"
          >
            Entrar no jogo — 7 dias de garantia →
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono-d text-[10px] tracking-[0.12em] uppercase text-muted-foreground text-center leading-loose">
          ♠ &nbsp;Dossiery · Projeto Conquista<br />
          Treina o homem. Respeita a autonomia. Vende competência, não dependência.
        </p>
      </footer>
    </div>
  )
}
