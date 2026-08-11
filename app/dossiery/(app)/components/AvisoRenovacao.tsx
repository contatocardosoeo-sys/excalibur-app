import Link from 'next/link'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import { JANELA_RENOVACAO_DIAS } from '@/app/lib/dossiery/stripe'

// ♠ D330: o anual é pagamento único e morre no dia 365. Sem aviso, o cliente
// evapora e o LTV é amputado. Este banner aparece nos últimos 35 dias, dentro
// do app, onde ele já está usando o produto.
export default async function AvisoRenovacao() {
  if (!paywallAtivo()) return null

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('dossiery_assinaturas')
    .select('status, plano, renova_em, stripe_id')
    .eq('user_id', user.id)
    .maybeSingle()

  // Só o anual (one-time) precisa de aviso: mensal renova sozinho no cartão.
  if (!data?.renova_em || data.status !== 'ativo' || data.stripe_id) return null

  const dias = Math.ceil((new Date(data.renova_em).getTime() - Date.now()) / 86_400_000)
  if (dias > JANELA_RENOVACAO_DIAS || dias < 0) return null

  return (
    <div className="border-b border-[hsl(var(--brass)/0.4)] bg-[hsl(var(--brass)/0.08)]">
      <div className="mx-auto max-w-5xl px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13.5px] leading-snug">
          <span className="font-mono-d text-[10px] tracking-[0.16em] uppercase text-[hsl(var(--brass))] mr-2">
            Seu ano fecha em {dias} {dias === 1 ? 'dia' : 'dias'}
          </span>
          Renove agora por <b>R$597</b> e mantenha tudo: histórico, evolução e o arsenal.
        </p>
        <Link
          href="/dossiery/renovar"
          className="shrink-0 rounded-[4px] bg-primary text-primary-foreground font-semibold text-[13px] px-4 py-2 hover:opacity-90 transition"
        >
          Renovar meu ano →
        </Link>
      </div>
    </div>
  )
}
