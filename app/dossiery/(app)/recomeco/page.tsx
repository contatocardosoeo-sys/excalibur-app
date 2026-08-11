import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import { JANELA_OFERTA_MS } from '@/app/lib/dossiery/stripe'
import { PROTOCOLO_RECOMECO, TOTAL_JOGADAS_RECOMECO } from '@/app/lib/dossiery/protocoloRecomeco'
import OfertaCliente from '../../components/OfertaCliente'

export const dynamic = 'force-dynamic'

// ♠ Protocolo Recomeço — reconquista fria OU ciclo fechado com dignidade.
// Cross-sell R$97 na janela / R$147 depois.
export default async function RecomecoPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (paywallAtivo()) {
    if (!user) redirect('/dossiery/entrar?next=/dossiery/recomeco')
    const { data: linha } = await supabase
      .from('dossiery_assinaturas')
      .select('recomeco, updated_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (linha?.recomeco !== true) {
      const naJanela =
        !linha?.updated_at ||
        Date.now() - new Date(linha.updated_at).getTime() <= JANELA_OFERTA_MS
      return <RecomecoBloqueado naJanela={naJanela} />
    }
  }

  return <RecomecoConteudo />
}

function RecomecoConteudo() {
  let n = 0
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-10">
      <div className="border-b border-border pb-6">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          Arsenal · acesso vitalício
        </div>
        <h1 className="font-serif-d text-4xl mt-2">Protocolo Recomeço</h1>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-xl leading-relaxed">
          {TOTAL_JOGADAS_RECOMECO} jogadas em 6 fases — da verdade nua ao veredito.{' '}
          <span className="text-foreground">Leia a Fase 1 inteira antes de qualquer mensagem.</span>{' '}
          Este protocolo tem duas vitórias possíveis: voltar em outra dinâmica, ou fechar o ciclo
          com dignidade. As duas valem.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {PROTOCOLO_RECOMECO.map((f, i) => (
          <a
            key={f.fase}
            href={`#r${i}`}
            className="rounded-[4px] border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground transition"
          >
            {f.codinome}
          </a>
        ))}
      </div>

      {PROTOCOLO_RECOMECO.map((f, fi) => (
        <section key={f.fase} id={`r${fi}`} className="mt-10 scroll-mt-6">
          <div className="rounded-md border border-border bg-card p-5">
            <div className="font-mono-d text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {f.fase}
            </div>
            <h2 className="font-serif-d text-2xl mt-1">
              <span className="text-primary">{f.codinome}</span>
            </h2>
            <p className="text-[13px] text-muted-foreground mt-2">{f.objetivo}</p>
          </div>

          <div className="mt-3 space-y-3">
            {f.jogadas.map((j) => {
              n += 1
              return (
                <div key={j.t} className="rounded-md border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] mt-0.5 shrink-0">
                      {String(n).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[14.5px] leading-relaxed">{j.t}</p>
                      <p className="text-[12.5px] text-muted-foreground mt-2 leading-snug">
                        <span className="font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))]">
                          por quê ·{' '}
                        </span>
                        {j.p}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <p className="mt-12 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        ♠ na dúvida numa fase? Debriefa com o Coach antes de agir — frieza é a regra da casa.
      </p>
    </div>
  )
}

function RecomecoBloqueado({ naJanela }: { naJanela: boolean }) {
  const valor = naJanela ? 97 : 147
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          Arsenal bloqueado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Protocolo Recomeço</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed max-w-md mx-auto">
          Terminou e ela não sai da cabeça? Este é o protocolo da decisão FRIA:{' '}
          {TOTAL_JOGADAS_RECOMECO} jogadas em 6 fases — diagnóstico brutal (dá pra voltar? DEVERIA?),
          silêncio estratégico, reconstrução real, reaproximação sem carência, o encontro de reset,
          e o veredito: voltar em outra dinâmica ou fechar o ciclo com dignidade.
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-card p-5">
        <ul className="space-y-2.5">
          {PROTOCOLO_RECOMECO.slice(0, 4).map((f) => (
            <li key={f.fase} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
              <span className="text-primary font-bold shrink-0">✓</span>
              <span>
                <span className="text-foreground font-medium">{f.codinome}</span> — {f.objetivo}
              </span>
            </li>
          ))}
          <li className="flex gap-2.5 text-[13px] text-muted-foreground/70 leading-snug">
            <span className="shrink-0">…</span>+ 2 fases finais (Mesa Nova · Porta ou Ponte)
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-lg border-2 border-dashed border-primary bg-primary/[0.05] p-6">
        <div className="text-center mb-4">
          {naJanela ? (
            <>
              <span className="line-through text-muted-foreground text-lg mr-2">R$147</span>
              <span className="font-serif-d text-3xl text-primary">R$97</span>
              <p className="font-mono-d text-[10px] tracking-widest uppercase text-primary mt-1.5">
                condição da janela pós-compra — o servidor cumpre o prazo
              </p>
            </>
          ) : (
            <>
              <span className="font-serif-d text-3xl">R$147</span>
              <span className="text-muted-foreground text-[13px] ml-2">
                pagamento único · acesso vitalício
              </span>
            </>
          )}
        </div>
        <OfertaCliente
          oferta={naJanela ? 'recomeco_oto' : 'recomeco_app'}
          valor={valor}
          cta={`Destravar o Recomeço por R$${valor} →`}
          next="/dossiery/recomeco"
          nota="1 clique no cartão salvo · ou PIX na hora"
        />
      </div>

      <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        Aviso honesto: este protocolo tem uma fase que pode te dizer pra NÃO voltar
      </p>
    </div>
  )
}
