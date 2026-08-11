import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import { JANELA_OFERTA_MS } from '@/app/lib/dossiery/stripe'
import { PROTOCOLO_ENCONTRO, TOTAL_JOGADAS } from '@/app/lib/dossiery/protocoloEncontro'
import OfertaCliente from '../../components/OfertaCliente'

export const dynamic = 'force-dynamic'

// ♠ Protocolo Encontro — entrega do upsell.
// Comprou → manual completo. Não comprou → cross-sell (R$97 na janela de 60min
// pós-compra, R$147 depois — o servidor impõe a mesma regra).
export default async function EncontroPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (paywallAtivo()) {
    if (!user) redirect('/dossiery/entrar?next=/dossiery/encontro')
    const { data: linha } = await supabase
      .from('dossiery_assinaturas')
      .select('protocolo_encontro, updated_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (linha?.protocolo_encontro !== true) {
      // sem linha (webhook a caminho) → janela vale; com linha → 60min do updated_at
      const naJanela =
        !linha?.updated_at ||
        Date.now() - new Date(linha.updated_at).getTime() <= JANELA_OFERTA_MS
      return <EncontroBloqueado naJanela={naJanela} />
    }
  }

  return <EncontroConteudo />
}

function EncontroConteudo() {
  let n = 0
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-10">
      <div className="border-b border-border pb-6">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          09 · Arsenal · acesso vitalício
        </div>
        <h1 className="font-serif-d text-4xl mt-2">Protocolo Encontro</h1>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-xl leading-relaxed">
          Da marcação ao segundo encontro: {TOTAL_JOGADAS} jogadas em 7 fases, cada uma com o
          porquê. <span className="text-foreground">Leia a fase antes do encontro.</span> Na mesa,
          celular é jogada proibida.
        </p>
      </div>

      {/* nav de fases */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PROTOCOLO_ENCONTRO.map((f, i) => (
          <a
            key={f.fase}
            href={`#f${i}`}
            className="rounded-[4px] border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground transition"
          >
            {f.codinome}
          </a>
        ))}
      </div>

      {PROTOCOLO_ENCONTRO.map((f, fi) => (
        <section key={f.fase} id={`f${fi}`} className="mt-10 scroll-mt-6">
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
        ♠ voltou do encontro? Debriefa com o Coach: o que funcionou vira padrão, o que travou vira treino.
      </p>
    </div>
  )
}

function EncontroBloqueado({ naJanela }: { naJanela: boolean }) {
  const valor = naJanela ? 97 : 147
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          09 · Arsenal bloqueado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Protocolo Encontro</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed max-w-md mx-auto">
          90% queimam na mesa o que ganharam no chat. {TOTAL_JOGADAS} jogadas em 7 fases: convite
          fechado, anti-bolo, janela do beijo, D+1 do segundo encontro. Cada uma com o porquê.
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-card p-5">
        <ul className="space-y-2.5">
          {PROTOCOLO_ENCONTRO.slice(0, 4).map((f) => (
            <li key={f.fase} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
              <span className="text-primary font-bold shrink-0">✓</span>
              <span>
                <span className="text-foreground font-medium">{f.codinome}:</span> {f.objetivo}
              </span>
            </li>
          ))}
          <li className="flex gap-2.5 text-[13px] text-muted-foreground/70 leading-snug">
            <span className="shrink-0">…</span>+ 3 fases (Escalada · Fim no Pico · D+1)
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
                preço da janela pós-compra · quando fecha, fechou
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
          oferta={naJanela ? 'encontro_oto' : 'encontro_app'}
          valor={valor}
          cta={`Destravar o Protocolo por R$${valor} →`}
          next="/dossiery/encontro"
          nota="1 clique no cartão salvo · ou PIX na hora"
        />
      </div>
    </div>
  )
}
