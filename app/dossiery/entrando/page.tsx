import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { getSupabaseAdmin } from '@/app/lib/dossiery/supabaseAdmin'
import { getStripe, stripeConfigurado } from '@/app/lib/dossiery/stripe'
import { acharOuCriarUsuario, tokenDeEntrada } from '@/app/lib/dossiery/conta'

export const dynamic = 'force-dynamic'

// ♠ Ponte pós-compra do guest checkout.
// Ele pagou sem conta. Aqui a sessão é criada a partir da própria sessão de
// checkout do Stripe (que só quem pagou conhece) e ele segue pro funil logado,
// sem digitar senha nenhuma.
export default async function EntrandoPage({
  searchParams,
}: {
  searchParams: Promise<{ cs?: string; next?: string }>
}) {
  const { cs, next } = await searchParams
  // next só pode ser caminho interno do produto (nada de open redirect)
  const destino = next && next.startsWith('/dossiery') ? next : '/dossiery/base'
  const sep = destino.includes('?') ? '&' : '?'

  if (!cs || !stripeConfigurado()) redirect(destino)

  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // Já logado (comprou logado): segue reto, carregando o cs pro pixel.
  if (user) redirect(`${destino}${sep}cs=${encodeURIComponent(cs)}`)

  try {
    const sessao = await getStripe().checkout.sessions.retrieve(cs)
    const pago = sessao.payment_status === 'paid' || sessao.status === 'complete'
    const email = sessao.customer_details?.email || sessao.customer_email

    if (pago && email) {
      const admin = getSupabaseAdmin()
      // O webhook normalmente já criou. Isto cobre a corrida entre os dois.
      await acharOuCriarUsuario(admin, email)
      const token = await tokenDeEntrada(admin, email)
      if (token) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'magiclink',
        })
        if (!error) redirect(`${destino}${sep}cs=${encodeURIComponent(cs)}`)
      }
    }
  } catch (err) {
    // NEXT_REDIRECT precisa subir: o redirect do Next é lançado como erro.
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) throw err
    console.error('[dossiery/entrando]', err instanceof Error ? err.message : err)
  }

  // Falhou a entrada automática: nada de deixar o cara pagando e sem acesso.
  return (
    <div className="min-h-screen d-grid-bg grid place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid place-items-center w-16 h-16 rounded-full border border-[hsl(var(--brass))] text-[hsl(var(--brass))]">
          <span className="font-serif-d text-2xl">♠</span>
        </div>
        <div className="mt-6 font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(145_35%_55%)]">
          ✓ Pagamento confirmado
        </div>
        <h1 className="font-serif-d text-3xl mt-3">Falta um passo pro acesso.</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed">
          Sua compra entrou. Só não consegui te logar automaticamente agora. Entre com o mesmo
          e-mail que você usou no pagamento e o acesso já está lá dentro.
        </p>
        <Link
          href="/dossiery/entrar"
          className="mt-7 block rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 transition"
        >
          Entrar com meu e-mail →
        </Link>
        <p className="mt-5 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Qualquer problema, fala com o suporte com o comprovante em mãos
        </p>
      </div>
    </div>
  )
}
