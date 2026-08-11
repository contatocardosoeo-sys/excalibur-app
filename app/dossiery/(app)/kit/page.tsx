import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo, temKitAberturas } from '@/app/lib/dossiery/assinatura'
import { TOTAL_ABERTURAS } from '@/app/lib/dossiery/kitAberturas'
import OfertaCliente from '../../components/OfertaCliente'
import KitView from './KitView'

export const dynamic = 'force-dynamic'

// ♠ Kit 50 Aberturas — entrega do order bump.
// Comprou (bump ou destrave) → conteúdo. Não comprou → cross-sell R$37.
export default async function KitPage() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (paywallAtivo()) {
    if (!user) redirect('/dossiery/entrar?next=/dossiery/kit')
    const tem = await temKitAberturas(supabase, user.id)
    if (!tem) return <KitBloqueado />
  }

  return <KitView />
}

function KitBloqueado() {
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          08 · Arsenal bloqueado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Kit 50 Aberturas Que Não Morrem</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed max-w-md mx-auto">
          {TOTAL_ABERTURAS} aberturas que puxam resposta: match novo, resposta seca, conversa
          morta, pós-encontro. Cada uma com o porquê. Adapta na sua voz e manda.
        </p>
      </div>

      <div className="mt-8 rounded-lg border-2 border-dashed border-[hsl(var(--brass))] bg-[hsl(var(--brass)/0.06)] p-6">
        <div className="text-center mb-4">
          <span className="font-serif-d text-3xl">R$37</span>
          <span className="text-muted-foreground text-[13px] ml-2">pagamento único · acesso vitalício</span>
        </div>
        <OfertaCliente
          oferta="kit"
          valor={37}
          cta={`Destravar as ${TOTAL_ABERTURAS} aberturas por R$37 →`}
          next="/dossiery/kit"
          nota="1 clique no cartão salvo · ou PIX na hora"
        />
      </div>

      <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        Mesmo preço do checkout. Sem multa por destravar depois
      </p>
    </div>
  )
}
