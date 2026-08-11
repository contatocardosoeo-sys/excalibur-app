import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import { JANELA_OFERTA_MS } from '@/app/lib/dossiery/stripe'
import { PERFIL_MAGNETICO, TOTAL_ITENS_PERFIL } from '@/app/lib/dossiery/perfilMagnetico'
import OfertaCliente from '../../components/OfertaCliente'

export const dynamic = 'force-dynamic'

// ♠ Perfil Magnético — entrega do cross-sell (R$47 na janela / R$67 depois).
export default async function PerfilPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (paywallAtivo()) {
    if (!user) redirect('/dossiery/entrar?next=/dossiery/perfil')
    const { data: linha } = await supabase
      .from('dossiery_assinaturas')
      .select('perfil_magnetico, updated_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (linha?.perfil_magnetico !== true) {
      const naJanela =
        !linha?.updated_at ||
        Date.now() - new Date(linha.updated_at).getTime() <= JANELA_OFERTA_MS
      return <PerfilBloqueado naJanela={naJanela} />
    }
  }

  return <PerfilConteudo />
}

function PerfilConteudo() {
  let n = 0
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 py-10">
      <div className="border-b border-border pb-6">
        <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
          Arsenal · acesso vitalício
        </div>
        <h1 className="font-serif-d text-4xl mt-2">Perfil Magnético</h1>
        <p className="text-muted-foreground mt-3 text-[14px] max-w-xl leading-relaxed">
          {TOTAL_ITENS_PERFIL} ações para o Instagram (e apps) que trabalha por você 24/7.{' '}
          <span className="text-foreground">Execute em ordem</span> — fotos primeiro, o resto em
          cima. Tudo com a SUA vida real: a vitrine melhora, o produto é você.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {PERFIL_MAGNETICO.map((g, i) => (
          <a
            key={g.grupo}
            href={`#p${i}`}
            className="rounded-[4px] border border-border bg-card px-3 py-1.5 text-[12px] text-muted-foreground hover:border-[hsl(var(--brass))] hover:text-foreground transition"
          >
            {g.grupo.split('—')[0].trim()}
          </a>
        ))}
      </div>

      {PERFIL_MAGNETICO.map((g, gi) => (
        <section key={g.grupo} id={`p${gi}`} className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-[hsl(var(--brass))]" />
            <h2 className="font-serif-d text-2xl">{g.grupo}</h2>
          </div>
          <p className="text-[13px] text-muted-foreground mt-2 max-w-xl">{g.desc}</p>

          <div className="mt-4 space-y-3">
            {g.itens.map((item) => {
              n += 1
              return (
                <div key={item.t} className="rounded-md border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono-d text-[11px] text-[hsl(var(--brass))] mt-0.5 shrink-0">
                      {String(n).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[14.5px] leading-relaxed">{item.t}</p>
                      <p className="text-[12.5px] text-muted-foreground mt-2 leading-snug">
                        <span className="font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))]">
                          por quê ·{' '}
                        </span>
                        {item.p}
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
        ♠ perfil arrumado? Agora as aberturas do Kit rendem o dobro — /dossiery/kit
      </p>
    </div>
  )
}

function PerfilBloqueado({ naJanela }: { naJanela: boolean }) {
  const valor = naJanela ? 47 : 67
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          Arsenal bloqueado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Perfil Magnético</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed max-w-md mx-auto">
          Antes de responder, ela olha seu perfil — e decide em 5 segundos. {TOTAL_ITENS_PERFIL}{' '}
          ações em 6 frentes: o stack das 6 fotos, bio e grade, stories que puxam DM, o jogo dos
          stories dela, DM game e a auditoria do que apagar hoje.
        </p>
      </div>

      <div className="mt-6 rounded-md border border-border bg-card p-5">
        <ul className="space-y-2.5">
          {PERFIL_MAGNETICO.slice(0, 4).map((g) => (
            <li key={g.grupo} className="flex gap-2.5 text-[13px] text-muted-foreground leading-snug">
              <span className="text-primary font-bold shrink-0">✓</span>
              <span className="text-foreground font-medium">{g.grupo}</span>
            </li>
          ))}
          <li className="flex gap-2.5 text-[13px] text-muted-foreground/70 leading-snug">
            <span className="shrink-0">…</span>+ DM Game · Higiene de Perfil
          </li>
        </ul>
      </div>

      <div className="mt-6 rounded-lg border-2 border-dashed border-primary bg-primary/[0.05] p-6">
        <div className="text-center mb-4">
          {naJanela ? (
            <>
              <span className="line-through text-muted-foreground text-lg mr-2">R$67</span>
              <span className="font-serif-d text-3xl text-primary">R$47</span>
              <p className="font-mono-d text-[10px] tracking-widest uppercase text-primary mt-1.5">
                condição da janela pós-compra — o servidor cumpre o prazo
              </p>
            </>
          ) : (
            <>
              <span className="font-serif-d text-3xl">R$67</span>
              <span className="text-muted-foreground text-[13px] ml-2">
                pagamento único · acesso vitalício
              </span>
            </>
          )}
        </div>
        <OfertaCliente
          oferta={naJanela ? 'perfil_oto' : 'perfil_app'}
          valor={valor}
          cta={`Destravar o Perfil Magnético por R$${valor} →`}
          next="/dossiery/perfil"
          nota="1 clique no cartão salvo · ou PIX na hora"
        />
      </div>
    </div>
  )
}
