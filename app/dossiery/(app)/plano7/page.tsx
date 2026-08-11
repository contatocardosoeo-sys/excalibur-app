import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import { PLANO_7_DIAS, TOTAL_PASSOS_PLANO } from '@/app/lib/dossiery/plano7dias'
import OfertaCliente from '../../components/OfertaCliente'

export const dynamic = 'force-dynamic'

// ♠ Plano 7 Dias — entrega do tripwire (R$19, porta de entrada da esteira).
export default async function Plano7Page() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (paywallAtivo()) {
    if (!user) redirect('/dossiery/entrar?next=/dossiery/plano7')
    const { data: linha } = await supabase
      .from('dossiery_assinaturas')
      .select('plano_7d')
      .eq('user_id', user.id)
      .maybeSingle()
    if (linha?.plano_7d !== true) return <Plano7Bloqueado />
  }

  return <Plano7Conteudo />
}

function Plano7Conteudo() {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-10">
      <div className="border-b border-border pb-6">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          Bootcamp · uma missão por dia · &lt;30min
        </div>
        <h1 className="font-serif-d text-4xl mt-2">Plano 7 Dias</h1>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-xl leading-relaxed">
          Sete dias, sete missões, {TOTAL_PASSOS_PLANO} passos executáveis. Regra única:{' '}
          <span className="text-foreground">missão do dia se cumpre NO dia</span>. Ler sem executar
          é o Modo Trouxa com sensação de progresso.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {PLANO_7_DIAS.map((d) => (
          <a
            key={d.dia}
            href={`#d${d.dia}`}
            className="rounded-[4px] border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground transition"
          >
            D{d.dia} · {d.titulo}
          </a>
        ))}
      </div>

      {PLANO_7_DIAS.map((d) => (
        <section key={d.dia} id={`d${d.dia}`} className="mt-10 scroll-mt-6">
          <div className="rounded-md border border-primary/40 bg-primary/[0.05] p-5 relative overflow-hidden">
            <div className="absolute left-0 inset-y-0 w-1 bg-primary" />
            <div className="font-mono-d text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Dia {d.dia} · {d.titulo}
            </div>
            <h2 className="font-serif-d text-2xl mt-1">
              <span className="text-primary">{d.codinome}</span>
            </h2>
            <p className="text-[14px] text-foreground mt-2 font-medium">{d.missao}</p>
            <p className="text-[13px] text-muted-foreground mt-1.5">{d.briefing}</p>
          </div>

          <div className="mt-3 space-y-3">
            {d.passos.map((p, i) => (
              <div key={p.t} className="rounded-md border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] mt-0.5 shrink-0">
                    {d.dia}.{i + 1}
                  </span>
                  <div>
                    <p className="text-[14.5px] leading-relaxed">{p.t}</p>
                    <p className="text-[12.5px] text-muted-foreground mt-2 leading-snug">
                      <span className="font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))]">
                        por quê ·{' '}
                      </span>
                      {p.p}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-md border border-[hsl(145_35%_35%)] bg-[hsl(145_35%_20%/0.12)] px-4 py-3">
            <span className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-[hsl(145_35%_55%)]">
              Missão cumprida quando ·{' '}
            </span>
            <span className="text-[13px] text-foreground">{d.criterio}</span>
          </div>
        </section>
      ))}

      <p className="mt-12 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        ♠ terminou o D7? O Operador completo (Raio-X + Coach ilimitados) é o próximo nível — /dossiery/precos
      </p>
    </div>
  )
}

function Plano7Bloqueado() {
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          Bootcamp de entrada
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Plano 7 Dias</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed max-w-md mx-auto">
          Do zero a conversas vivas e 1 encontro proposto em uma semana. Uma missão por dia, menos
          de 30 minutos, com o porquê de cada passo — perfil, reativação, abertura, sustentação,
          proposta, anti-bolo e debrief.
        </p>
      </div>

      <div className="mt-8 rounded-lg border-2 border-dashed border-[hsl(var(--brass))] bg-[hsl(var(--brass)/0.06)] p-6">
        <div className="text-center mb-4">
          <span className="font-serif-d text-3xl">R$19</span>
          <span className="text-muted-foreground text-[13px] ml-2">pagamento único · acesso vitalício</span>
        </div>
        <OfertaCliente
          oferta="plano7"
          valor={19}
          cta="Começar o bootcamp por R$19 →"
          next="/dossiery/plano7"
          nota="PIX ou cartão · menos que um lanche"
        />
      </div>

      <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        Garantia de 7 dias — se não executar, devolvo seu dinheiro e seu Modo Trouxa
      </p>
    </div>
  )
}
