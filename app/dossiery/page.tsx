import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dossiery — Saia do Modo Trouxa. Vire o homem que escolhe.',
  description:
    'A IA que faz o raio-X das suas conversas, te treina no jogo real e desinstala o Modo Trouxa. Sem decoreba, sem fingir ser outro, sem correr atrás. 7 dias de garantia.',
}

/* ————— blocos de conteúdo ————— */

const CENAS = [
  {
    hora: '23:47',
    cena: 'Visualizada às 22:10. Você já releu sua mensagem 6 vezes. Estava boa. Ela viu. E nada.',
  },
  {
    hora: 'SÁB',
    cena: '“Confirmado pra hoje?” Enviado. Uma hora depois: “amiga, surgiu um imprevisto 🥺”. Você já sabia. Sempre sabe.',
  },
  {
    hora: '14:32',
    cena: 'Ela respondeu “kkkk verdade”. Você digitou, apagou, digitou de novo. Mandou uma pergunta. A conversa morreu ali.',
  },
  {
    hora: '02:15',
    cena: '“Você é incrível, sério… queria que os caras fossem como você.” Tradução: você é o conselheiro dela. O outro é o cara.',
  },
  {
    hora: 'DOM',
    cena: 'Você respondeu em 40 segundos. Ela, em 9 horas. Você de novo em 40 segundos. Quem você acha que está correndo atrás?',
  },
]

const SINTOMAS = [
  'Responde na hora, sempre — e espera horas pela migalha de volta',
  'Agrada, concorda, se molda — e vira “o amigo” em vez de o homem',
  'Puxa papo com medo de incomodar — e a conversa nasce morta',
  'Aceita ser a segunda opção — e chama isso de “ter paciência”',
  'Decora frase pronta de app — e trava quando ela está na sua frente',
]

const FALHAS = [
  {
    t: 'Cantada pronta / apps de “rizz”',
    d: 'Atacam a frase, não a postura. Resultado documentado: 6 em cada 10 mulheres já desconfiam de texto escrito por IA (estudo Norton). Ela fareja. E quando o encontro chega, você está lá sem a muleta — travado.',
  },
  {
    t: 'Curso de PUA / “técnicas de sedução”',
    d: 'Te ensinam a fingir ser outro. Funciona por 20 minutos — até a máscara pesar. Pesquisa da Universidade do Kansas: negging e joguinho não têm eficácia geral comprovada. Só te tornam mais um personagem.',
  },
  {
    t: 'Conselho de amigo / “seja você mesmo”',
    d: 'Seu amigo não sabe ler o sinal dela melhor que você. E “ser você mesmo” no Modo Trouxa é ser o trouxa com sinceridade. O problema nunca foi autenticidade. Foi calibragem.',
  },
]

const FASES = [
  {
    n: '01',
    nome: 'RAIO-X',
    d: 'Você cola a conversa real. A IA te devolve a leitura fria: o interesse dela (sem ilusão), onde você secou, onde correu atrás, onde matou o clima. Em minutos, você vê o Modo Trouxa operando — pela primeira vez, de fora.',
  },
  {
    n: '02',
    nome: 'TREINO',
    d: 'Um coach de elite, 24/7, treinado no cânone que forma homens de presença: Manson, Glover, Cabane, Carnegie, Gottman, Perel. Cada resposta vem com o porquê — você não decora frase, você entende o jogo.',
  },
  {
    n: '03',
    nome: 'CAMPO',
    d: 'Jogadas na SUA voz — sugestões que você edita e manda como quiser. Leitura de sinal pra nunca mais tomar bolo sem ver de longe. E a régua de quando avançar, quando segurar e quando sair com classe.',
  },
]

const BULLETS = [
  'O erro que mata a maioria das conversas logo depois do “oi” — você comete achando que é educação',
  'Por que responder rápido demais te rebaixa na percepção dela — e o timing que inverte a dinâmica',
  'A leitura de 10 segundos que separa “ela está a fim” de “ela está te enrolando” — chega de bolo surpresa',
  'Como demonstrar interesse sem cheiro de carência — a linha exata entre presença e perseguição',
  'O jeito de sair da prateleira de “segunda opção” que não envolve sumir nem se humilhar',
  'Por que a cantada “perfeita” do app te sabota exatamente na hora do encontro',
  'Como transformar “kkkk” e resposta seca em conversa viva — ou saber a hora de gastar sua energia em outro lugar',
  'O princípio de 100 anos de psicologia que faz mulher se interessar por quem NÃO corre atrás — e como aplicar sem joguinho',
]

const NUNCA = [
  'Frase pronta pra copiar e colar como um robô',
  'Responder por você fingindo ser você',
  'Negging, manipulação, joguinho de guru',
  'Tática pra “vencer o não” de alguém',
  'Papo vulgar sobre mulheres',
]

const SEMPRE = [
  'Raio-X brutal e honesto das suas conversas',
  'Treino de postura, calibragem e leitura de sinal',
  'Sugestões na sua voz — você no comando, sempre',
  'O porquê por trás de cada jogada, com base real',
  'Um homem melhor no fim do processo. Esse é o produto.',
]

const FAQ = [
  {
    q: 'Isso é mais um app de cantada?',
    a: 'É o oposto. App de cantada te dá o peixe podre: uma frase que não é sua, que ela fareja, e que te deixa dependente. O Dossiery desinstala o comportamento que te faz precisar de cantada. A meta declarada é você não precisar da gente.',
  },
  {
    q: 'Isso é manipulação / PUA?',
    a: 'Não — e essa é a nossa maior briga. Negging e joguinho são a receita do personagem inseguro, e mulher de valor percebe em minutos. Nós treinamos o homem real: postura, leitura, comunicação. É por isso que funciona no encontro, não só no chat.',
  },
  {
    q: 'A IA vai falar por mim?',
    a: 'Nunca. Toda sugestão é ponto de partida na sua voz, pra você editar e mandar. Quem aparece é você — versão treinada.',
  },
  {
    q: 'Funciona pra tímido / introvertido?',
    a: 'Foi desenhado pra quem trava. O treino é privado, sem plateia, no seu ritmo. Você erra aqui dentro — com feedback — pra acertar lá fora.',
  },
  {
    q: 'E se eu não gostar?',
    a: '7 dias de garantia incondicional. Não curtiu? Um clique no portal, devolvemos 100%. Sem formulário de retenção, sem “tem certeza?”, sem mimimi.',
  },
  {
    q: 'Quanto custa?',
    a: 'R$97/mês, ou R$697/ano (sai R$58/mês). Uma sessão de coach humano custa R$300–500 — aqui é um coach de elite no seu bolso, 24/7, por R$3,23 por dia no plano anual.',
  },
]

/* ————— componentes ————— */

function CTA({ children = 'Entrar no Protocolo →', sub }: { children?: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        href="/dossiery/precos"
        className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] px-8 py-4 hover:opacity-90 transition"
      >
        {children}
      </Link>
      <span className="font-mono-d text-[10px] tracking-[0.16em] uppercase text-muted-foreground/70">
        {sub ?? '7 dias de garantia · cancele em 2 cliques'}
      </span>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono-d text-[11px] tracking-[0.24em] uppercase text-[hsl(var(--brass))]">{children}</div>
  )
}

/* ————— página ————— */

export default function DossierySalesPage() {
  return (
    <div className="relative overflow-hidden">
      {/* topbar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">♠</span>
            <span className="font-serif-d text-[17px] tracking-tight">Dossiery</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dossiery/entrar" className="text-[13px] text-muted-foreground hover:text-primary transition">
              Entrar
            </Link>
            <Link
              href="/dossiery/precos"
              className="text-[13px] font-semibold rounded-[4px] bg-primary text-primary-foreground px-4 py-1.5 hover:opacity-90 transition"
            >
              Entrar no Protocolo
            </Link>
          </div>
        </div>
      </header>

      {/* ============ 1 · HERO ============ */}
      <section className="relative border-b border-border">
        <div className="d-grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 pt-16 md:pt-24 pb-14 text-center">
          <Kicker>Aviso: isso aqui vai doer antes de resolver</Kicker>
          <h1 className="font-serif-d font-semibold leading-[1.02] tracking-tight text-4xl md:text-6xl mt-5 text-balance">
            Ser ignorado, tomar bolo e virar “o amigo” não é azar.
            <br />
            <span className="text-primary">É o Modo Trouxa operando por você.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-[16px] leading-relaxed">
            Ninguém te ensinou o jogo — te ensinaram a agradar. O Dossiery instala o{' '}
            <span className="text-foreground font-medium">Protocolo Operador</span>: a IA que faz o
            raio-X das suas conversas reais, te treina como um coach de elite e te devolve o que
            tiraram de você — <span className="text-foreground font-medium">a postura de homem que escolhe</span>,
            em vez de esperar ser escolhido.
          </p>
          <div className="mt-9">
            <CTA>Sair do Modo Trouxa agora →</CTA>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono-d text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">
            <span>Visualizada sem resposta</span>
            <span>·</span>
            <span>“kkkk” e sumiu</span>
            <span>·</span>
            <span>Bolo de sábado</span>
            <span>·</span>
            <span>“Você é 10, mas…”</span>
            <span>·</span>
            <span>Sempre a segunda opção</span>
          </div>
        </div>
      </section>

      {/* ============ 2 · AGITAÇÃO (cenas) ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>Você conhece esse filme de cor</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3 max-w-2xl">
            Não é uma noite ruim. É um padrão. E ele está cobrando caro.
          </h2>
          <div className="mt-9 space-y-4">
            {CENAS.map((c) => (
              <div key={c.cena} className="flex gap-4 rounded-md border border-border bg-background p-5">
                <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] tracking-widest shrink-0 pt-1">
                  {c.hora}
                </span>
                <p className="text-[14.5px] text-muted-foreground leading-relaxed">{c.cena}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-foreground max-w-2xl leading-relaxed">
            O custo não é só a sexta à noite no sofá. É o que isso está fazendo com a{' '}
            <span className="text-foreground font-medium">imagem que você tem de si mesmo</span> — cada
            vácuo confirmando a história de que “não é pra você”. Daqui a 3 anos, esse padrão não
            muda sozinho. Ele cristaliza.
          </p>
        </div>
      </section>

      {/* ============ 3 · VILÃO ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>O vilão tem nome</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3">
            O <span className="text-primary">Modo Trouxa</span>: o software social que instalaram em você.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-2xl leading-relaxed">
            Desde moleque te ensinaram que agradar = ser escolhido. Seja bonzinho. Não incomode.
            Faça tudo por ela. Resultado: você virou previsível, disponível demais e invisível — o
            combo exato que mata atração. <span className="text-foreground">A culpa de instalar não foi sua.</span>{' '}
            Continuar rodando esse programa depois de hoje, aí sim, é.
          </p>
          <div className="mt-8 rounded-md border border-border bg-card p-6">
            <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Diagnóstico rápido — quantos você reconhece?
            </div>
            <ul className="space-y-3">
              {SINTOMAS.map((s) => (
                <li key={s} className="flex gap-3 text-[14.5px] text-muted-foreground leading-snug">
                  <span className="text-destructive font-bold shrink-0">✕</span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13.5px] text-foreground">
              Dois ou mais? O Modo Trouxa está no comando — e nenhuma cantada pronta resolve isso.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 4 · POR QUE TUDO FALHOU ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>A absolvição — e a acusação certa</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3 max-w-2xl">
            Você já tentou. Não funcionou. E agora você sabe por quê.
          </h2>
          <div className="mt-9 grid md:grid-cols-3 gap-4">
            {FALHAS.map((f) => (
              <div key={f.t} className="rounded-md border border-border border-t-2 border-t-destructive bg-background p-5">
                <h3 className="font-serif-d text-lg leading-snug">{f.t}</h3>
                <p className="text-[13px] text-muted-foreground mt-2.5 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-foreground max-w-2xl leading-relaxed">
            Tudo isso ataca o sintoma — a frase, a técnica, o truque. Nenhum ataca o vilão: o{' '}
            <span className="text-foreground font-medium">comportamento</span>. É por isso que o mercado
            inteiro falhou com você. E é exatamente aí que o Dossiery entra.
          </p>
          <div className="mt-8">
            <CTA />
          </div>
        </div>
      </section>

      {/* ============ 5 · MECANISMO ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>O mecanismo</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3">
            O <span className="text-primary">Protocolo Operador</span> — 3 fases pra desinstalar o Modo Trouxa.
          </h2>
          <div className="mt-9 space-y-4">
            {FASES.map((f) => (
              <div key={f.n} className="rounded-md border border-border bg-card p-6 relative overflow-hidden">
                <div className="absolute left-0 inset-y-0 w-1 bg-primary" />
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-d text-[12px] text-[hsl(var(--brass))] tracking-widest">FASE {f.n}</span>
                  <h3 className="font-serif-d text-2xl">{f.nome}</h3>
                </div>
                <p className="text-[14.5px] text-muted-foreground mt-3 leading-relaxed max-w-2xl">{f.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-md border border-[hsl(var(--brass)/0.5)] bg-[hsl(var(--brass)/0.06)] p-6">
            <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))] mb-2">
              Por que isso só existe agora
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Um coach de verdade lendo cada conversa sua custaria R$300–500 por sessão — e não
              estaria disponível às 23h de um sábado, quando o jogo acontece. A IA de ponta tornou
              possível o que era privilégio: <span className="text-foreground">treino de elite, 24/7, no seu bolso.</span>{' '}
              Os apps de cantada usaram essa tecnologia pra te dar o peixe. Nós usamos pra te ensinar a pescar.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 6 · BULLETS ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>Dentro do arsenal</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3">O que você destrava já na primeira semana:</h2>
          <ul className="mt-8 grid md:grid-cols-2 gap-x-8 gap-y-4">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3 text-[14px] text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold shrink-0">→</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <CTA>Quero isso no meu jogo →</CTA>
          </div>
        </div>
      </section>

      {/* ============ 7 · TRUST / ANTI-PUA ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Kicker>Leia antes de assinar</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3 max-w-2xl">
            Se você quer truque pra enganar mulher, sai dessa página.
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-2xl leading-relaxed">
            Sério. Tem site de “segredos proibidos” aos montes por aí. O Dossiery é pra homem que
            entendeu que o único jogo que compensa é ficar bom de verdade — porque personagem cansa,
            e trouxa autêntico continua trouxa. Nosso contrato é claro:
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="rounded-md border border-border border-t-2 border-t-destructive bg-card p-6">
              <h3 className="font-mono-d text-[12px] tracking-[0.16em] uppercase text-destructive mb-4">
                Aqui NUNCA tem
              </h3>
              <ul className="space-y-2.5">
                {NUNCA.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[14px] text-muted-foreground">
                    <span className="text-destructive font-bold">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border border-t-2 border-t-[hsl(145_30%_45%)] bg-card p-6">
              <h3 className="font-mono-d text-[12px] tracking-[0.16em] uppercase text-[hsl(145_35%_55%)] mb-4">
                Aqui SEMPRE tem
              </h3>
              <ul className="space-y-2.5">
                {SEMPRE.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[14px] text-muted-foreground">
                    <span className="text-[hsl(145_40%_55%)] font-bold">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 8 · OFERTA ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Kicker>A conta é simples</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3">
            R$3,23 por dia pra nunca mais ser o cara que espera.
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Coach humano: R$300–500 <em>por sessão</em>. Curso de guru: R$1.997 gravado em 2019.
            O Dossiery: <span className="text-foreground font-medium">R$97/mês</span> — ou{' '}
            <span className="text-foreground font-medium">R$697/ano</span> (R$58/mês) — com o
            Protocolo inteiro: Raio-X, Treino e Campo, ilimitados.
          </p>
          <div className="mt-8 rounded-md border border-primary/50 bg-background p-7 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
            <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
              Garantia blindada · 7 dias
            </div>
            <p className="text-[14.5px] text-muted-foreground mt-3 leading-relaxed">
              Entra, roda o Raio-X nas suas conversas, fala com o Coach. Se em 7 dias você não
              enxergar seu jogo com uma clareza que nunca teve —{' '}
              <span className="text-foreground">um clique, 100% de volta.</span> Eu assumo o risco
              porque eu sei o que acontece quando você vê o Modo Trouxa de fora.
            </p>
          </div>
          <div className="mt-8">
            <CTA>Entrar no Protocolo por R$97 →</CTA>
          </div>
        </div>
      </section>

      {/* ============ 9 · FAQ ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Kicker>Objeções na mesa</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3">Perguntas de quem está quase dentro.</h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-md border border-border bg-card p-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-serif-d text-[16.5px]">{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 10 · ÚLTIMA BATIDA ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-serif-d text-3xl md:text-5xl leading-tight text-balance">
            Daqui a 30 dias você vai estar em um de dois lugares.
          </h2>
          <p className="mt-6 text-[15.5px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            No mesmo sofá, relendo mensagem visualizada, esperando a migalha — com o Modo Trouxa um
            mês mais entranhado. Ou um mês dentro do Protocolo: lendo sinal que antes era invisível,
            conversando com presença, e sentindo no corpo a diferença entre{' '}
            <span className="text-foreground">correr atrás e ser procurado</span>.
          </p>
          <p className="mt-4 text-[15.5px] text-foreground font-medium">O sofá é grátis. E é caríssimo.</p>
          <div className="mt-9">
            <CTA>Sair do Modo Trouxa agora →</CTA>
          </div>
          <p className="mt-10 text-[13px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            <span className="font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))] mr-2">P.S.</span>
            Recapitulando: Protocolo Operador completo (Raio-X + Treino + Campo, ilimitados), R$97/mês
            ou R$697/ano, garantia incondicional de 7 dias, cancelamento em 2 cliques. O único
            cenário em que você perde é o cenário em que você fecha essa página e continua igual.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10">
        <p className="font-mono-d text-[10px] tracking-[0.12em] uppercase text-muted-foreground text-center leading-loose">
          ♠ &nbsp;Dossiery · Projeto Conquista<br />
          Treina o homem. Respeita a autonomia. Vende competência, não dependência.<br />
          <Link href="/dossiery/precos" className="hover:text-primary transition">Preços</Link>
          {' · '}
          <Link href="/dossiery/entrar" className="hover:text-primary transition">Entrar</Link>
        </p>
      </footer>
    </div>
  )
}
