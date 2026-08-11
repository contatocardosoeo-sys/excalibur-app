import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import MobileCTA from './components/MobileCTA'
import Provas from './components/Provas'
import VagasFundador from './components/VagasFundador'
import { DEGRAUS, PRECO_DEPOIS } from '@/app/lib/dossiery/fundador'

export const metadata: Metadata = {
  title: 'Dossiery: do vácuo ao encontro marcado',
  description:
    'A IA que lê suas conversas, aponta o vacilo e treina você até ela responder na hora. 7 dias de garantia.',
  openGraph: {
    title: 'Dossiery: vire o cara que ela responde na hora.',
    description: 'Raio-X das suas conversas + treino 24/7. 7 dias de garantia.',
    images: [{ url: '/dossiery/hero.jpg', width: 1440, height: 2560 }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

/* ESCASSEZ: números em app/lib/dossiery/fundador.ts. Cumpra-os: é o que torna a escassez real. */

/* ===== before/after: conversas simuladas ===== */
type Bolha = { by: 'ela' | 'ele'; t: string; meta?: string }
const CONVERSAS: { titulo: string; antes: Bolha[]; depois: Bolha[]; legenda: string }[] = [
  {
    titulo: 'O papo que morria no “oi”',
    antes: [
      { by: 'ele', t: 'oi sumida kk tudo bem?' },
      { by: 'ela', t: 'oi… tudo e vc' },
      { by: 'ele', t: 'tudo! então, o que vc gosta de fazer?' },
      { by: 'ele', t: 'visualizado 21:40', meta: 'sem resposta' },
    ],
    depois: [
      { by: 'ele', t: 'deixa eu adivinhar: café, playlist obscura e zero paciência pra papo furado' },
      { by: 'ela', t: 'KKKK quem te contou' },
      { by: 'ela', t: 'isso foi assustadoramente preciso' },
      { by: 'ele', t: 'é dom. quinta você me mostra a tal playlist pessoalmente' },
      { by: 'ela', t: 'marcado 😏' },
    ],
    legenda: 'Mesma mulher. Só mudou o que ele escreveu.',
  },
  {
    titulo: 'Ela esfriou (a reconquista)',
    antes: [
      { by: 'ele', t: 'vc sumiu de novo :(' },
      { by: 'ele', t: 'fiz algo errado?' },
      { by: 'ele', t: 'pode falar comigo' },
      { by: 'ela', t: 'visualizado', meta: 'te arquivou' },
    ],
    depois: [
      { by: 'ele', t: 'tô te devendo aquele desafio de sinuca. ainda vale. a menos que você tenha medo de perder' },
      { by: 'ela', t: 'MEDO? kkk você que vai chorar' },
      { by: 'ele', t: 'prova sexta então. 21h' },
      { by: 'ela', t: 'tá bom confiante 😏' },
    ],
    legenda: 'Carência ela arquiva. Desafio com hora marcada ela responde.',
  },
]

/* ===== componentes ===== */
function CTA({
  children = 'Entrar no Protocolo →',
  sub,
  align = 'center',
}: {
  children?: React.ReactNode
  sub?: string
  align?: 'center' | 'md-left'
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === 'md-left' ? 'items-center md:items-start' : 'items-center'}`}>
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

function Chat({ msgs, tag }: { msgs: Bolha[]; tag: 'antes' | 'depois' }) {
  const antes = tag === 'antes'
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
        <span className="grid place-items-center w-7 h-7 rounded-full bg-secondary text-muted-foreground text-xs">♀</span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-foreground font-medium">M•••••</div>
          <div className="font-mono-d text-[9px] tracking-wide uppercase text-muted-foreground">online agora</div>
        </div>
        <span
          className={`font-mono-d text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 rounded-[3px] border ${
            antes ? 'border-destructive text-destructive' : 'border-[hsl(145_30%_45%)] text-[hsl(145_38%_55%)]'
          }`}
        >
          {antes ? 'Modo Trouxa' : 'Operador'}
        </span>
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        {msgs.map((m, i) =>
          m.meta ? (
            <div key={i} className="self-end text-right">
              <div className="font-mono-d text-[10px] text-muted-foreground/70">{m.t}</div>
              <div className="font-mono-d text-[9px] tracking-widest uppercase text-destructive/80 mt-0.5">
                {m.meta}
              </div>
            </div>
          ) : (
            <div
              key={i}
              className={`max-w-[82%] px-3.5 py-2 text-[13.5px] leading-snug rounded-2xl ${
                m.by === 'ele'
                  ? 'self-end bg-primary text-primary-foreground rounded-br-sm'
                  : 'self-start bg-secondary text-foreground rounded-bl-sm'
              }`}
            >
              {m.t}
            </div>
          )
        )}
      </div>
    </div>
  )
}

/* ===== página ===== */
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
          <Link
            href="/dossiery/precos"
            className="text-[13px] font-semibold rounded-[4px] bg-primary text-primary-foreground px-4 py-2.5 min-h-[44px] inline-flex items-center hover:opacity-90 transition"
          >
            Quero entrar
          </Link>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="d-grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-6 pt-12 md:pt-16 pb-12">
          <div className="grid md:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-center">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                <Kicker>Faixa {DEGRAUS[0].nome} · {DEGRAUS[0].vagas} primeiras vagas</Kicker>
              </div>
              <h1 className="font-serif-d font-semibold leading-[0.98] tracking-tight text-[2.5rem] md:text-6xl mt-4 text-balance">
                Você relê a mensagem visualizada.
                <br />
                <span className="text-primary">Ele já marcou o encontro.</span>
              </h1>
              <p className="text-[16px] md:text-[17px] text-foreground/90 mt-5 md:max-w-lg leading-relaxed">
                Ele não é mais bonito que você. Ele só não joga no{' '}
                <b className="text-foreground">Modo Trouxa</b>. O Dossiery lê suas conversas e
                aponta o vacilo. Depois te treina até virar{' '}
                <b className="text-foreground">Operador</b>: o cara que ela responde na hora.
              </p>
              <div className="mt-7" id="cta-hero">
                <CTA align="md-left" sub="Garantia de 7 dias · PIX ou cartão">
                  Quero sair do vácuo →
                </CTA>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="rotate-[2deg] rounded-[4px] border border-border bg-card p-2 shadow-[0_28px_70px_-28px_rgba(0,0,0,.85)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
                  <Image
                    src="/dossiery/hero.jpg"
                    alt="Registro de campo: um operador diante da cidade, à noite"
                    fill
                    sizes="(min-width: 768px) 340px, 0px"
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-between px-1.5 pt-2 pb-0.5 font-mono-d text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
                  <span>Arquivo 001-A</span>
                  <span>Confidencial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROVA: before/after ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <Kicker>Abra o arquivo</Kicker>
            <h2 className="font-serif-d text-3xl md:text-[2.4rem] mt-3 text-balance">
              Mesmo cara, 30 dias de Protocolo.{' '}
              <span className="text-primary">Ela só sentiu a diferença.</span>
            </h2>
          </div>
          <div className="mt-10 space-y-10">
            {CONVERSAS.map((c) => (
              <div key={c.titulo}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Chat msgs={c.antes} tag="antes" />
                  <Chat msgs={c.depois} tag="depois" />
                </div>
                <p className="text-center text-[14px] text-muted-foreground mt-4 max-w-xl mx-auto">
                  <span className="text-foreground font-medium">{c.legenda}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/50 mt-8">
            Conversas ilustrativas do método · o treino é pra você escrever as suas
          </p>
        </div>
      </section>

      <Provas />

      {/* ============ MECANISMO: 3 passos ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <Kicker>Como a mesa vira</Kicker>
            <h2 className="font-serif-d text-3xl md:text-[2.4rem] mt-3">3 passos. Zero enrolação.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-9">
            {[
              { n: '01', t: 'RAIO-X', d: 'Cola a conversa. A IA mostra onde você entregou o jogo. Dói. E destrava.' },
              { n: '02', t: 'TREINO', d: 'Treino com uma IA que não passa pano. Cada resposta vem com o porquê, até virar reflexo.' },
              { n: '03', t: 'CAMPO', d: 'Travou no meio do papo, cola aqui: sai a jogada certa, na SUA voz.' },
            ].map((s) => (
              <div key={s.n} className="rounded-md border border-border bg-card p-6 relative overflow-hidden">
                <div className="absolute left-0 inset-y-0 w-1 bg-primary" />
                <div className="font-mono-d text-[11px] text-[hsl(var(--brass))] tracking-widest">{s.n}</div>
                <h3 className="font-serif-d text-xl mt-1.5">{s.t}</h3>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OFERTA + ESCASSEZ ============ */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-2xl px-6 py-14 text-center">
          <Kicker>O que você leva</Kicker>
          <h2 className="font-serif-d text-3xl md:text-4xl mt-3 text-balance">
            A vantagem injusta que outro cara{' '}
            <span className="text-primary">reza pra você não descobrir.</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-[15px]">
            Coach cobra R$300 a sessão. Isso aqui trabalha 24/7 por R$3 por dia.
          </p>

          <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-left max-w-lg mx-auto">
            {[
              'O que ela pensa de você, em 3 minutos',
              'O erro que te jogou na friendzone',
              'A resposta pro vácuo e pro “kkkk” seco',
              'Quem tá a fim × quem te usa de reserva',
              'A hora certa de chamar pro encontro',
              'Acesso na hora · anônimo · cancela em 2 cliques',
            ].map((b) => (
              <li key={b} className="flex gap-2.5 text-[14px] text-muted-foreground">
                <span className="text-primary font-bold">✓</span>
                {b}
              </li>
            ))}
          </ul>

          {/* escassez REAL */}
          <div className="mt-8 rounded-md border border-primary/50 bg-primary/[0.07] px-5 py-4 max-w-lg mx-auto">
            <p className="font-mono-d text-[11px] tracking-[0.16em] uppercase text-primary">
              ⚠ O preço sobe a cada faixa que fecha
            </p>
            <p className="text-[14px] text-foreground mt-1.5 leading-relaxed">
              Os {DEGRAUS[0].vagas} primeiros pagam <b>R${DEGRAUS[0].preco}</b> no ano. Fechou a
              faixa, sobe pra R${DEGRAUS[1].preco}, depois R${DEGRAUS[2].preco}, e no fim só sobra
              mensal de <b>R${PRECO_DEPOIS}</b>. E enquanto você “vai pensar”,{' '}
              <b>ela responde outro cara</b>.
            </p>
            <p className="mt-3 pt-3 border-t border-primary/20 text-[13px] text-muted-foreground">
              <VagasFundador />
            </p>
          </div>

          <div className="mt-8">
            <CTA sub={`12x de R$${DEGRAUS[0].parcela} ou R$${DEGRAUS[0].preco} no PIX · garantia em dobro`}>Garantir minha faixa →</CTA>
          </div>
        </div>
      </section>

      {/* ============ FAQ curto ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="font-serif-d text-2xl md:text-3xl text-center text-balance">
            As desculpas que sua cabeça já está inventando.
          </h2>
          <div className="mt-7 space-y-3">
            {[
              {
                q: '“E se alguém descobrir que eu uso?”',
                a: 'Ninguém descobre. Não conecta nas suas redes, não manda nada pra ninguém. Seus amigos só veem o resultado.',
              },
              {
                q: '“Deve ser joguinho de PUA…”',
                a: 'Cantada decorada quebra no primeiro encontro. O Dossiery treina o SEU papo até o cara confiante ser você. Regra da casa: aqui se treina homem, ninguém vigia mulher.',
              },
              {
                q: '“E se não funcionar pra mim?”',
                a: '7 dias pra testar. Pede reembolso em 1 clique e recebe 100%. Sem formulário.',
              },
            ].map((f) => (
              <details key={f.q} className="group rounded-md border border-border bg-card p-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-serif-d text-[16px]">{f.q}</span>
                  <span className="text-primary transition group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-2.5 text-[14px] text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="font-serif-d text-3xl md:text-5xl leading-tight text-balance">
            Sábado à noite ela vai sair.
            <br />
            <span className="text-primary">A única dúvida é com quem.</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-[15px] max-w-md mx-auto">
            Daqui a 7 dias você está do outro lado do chat. Ou relendo esta página, como releu
            aquela mensagem.
          </p>
          <div className="mt-8">
            <CTA sub={`Preço de fundador · sobe pra R$${PRECO_DEPOIS} depois`}>
              Virar o jogo agora →
            </CTA>
          </div>
        </div>
      </section>

      <MobileCTA />

      <footer className="mx-auto max-w-5xl px-6 pt-10 pb-28 md:pb-10">
        <p className="font-mono-d text-[10px] tracking-[0.12em] uppercase text-muted-foreground text-center">
          ♠ &nbsp;Dossiery · Treina o homem. Respeita a autonomia.
        </p>
        <nav className="d-rodape mt-1 flex flex-wrap items-center justify-center gap-x-1 font-mono-d text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
          <Link href="/dossiery/precos" className="d-toque hover:text-primary transition">Preços</Link>
          <span aria-hidden>·</span>
          <Link href="/dossiery/entrar" className="d-toque hover:text-primary transition">Entrar</Link>
          <span aria-hidden>·</span>
          <Link href="/dossiery/termos" className="d-toque hover:text-primary transition">Termos</Link>
          <span aria-hidden>·</span>
          <Link href="/dossiery/privacidade" className="d-toque hover:text-primary transition">Privacidade</Link>
        </nav>
      </footer>
    </div>
  )
}
