import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'
import OfertaCliente from '../../components/OfertaCliente'

export const dynamic = 'force-dynamic'

const RENOVACAO = 597

// ♠ Renovação do anual. Preço de fidelidade abaixo do degrau vigente:
// recuperar 30% da base custa menos que comprar o mesmo cliente de novo.
export default async function RenovarPage() {
  let dias: number | null = null

  if (paywallAtivo()) {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/dossiery/entrar?next=/dossiery/renovar')

    const { data } = await supabase
      .from('dossiery_assinaturas')
      .select('renova_em')
      .eq('user_id', user.id)
      .maybeSingle()
    if (data?.renova_em) {
      dias = Math.ceil((new Date(data.renova_em).getTime() - Date.now()) / 86_400_000)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="text-center">
        <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          {dias !== null && dias >= 0 ? `Seu ano fecha em ${dias} dias` : 'Renovação'}
        </div>
        <h1 className="font-serif-d text-4xl md:text-[42px] leading-[1.05] mt-4">
          Você não volta pra estaca zero.
          <br />
          <span className="text-primary">A não ser que deixe vencer.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
          Todo Raio-X que você colou, todo padrão que o Coach mapeou, sua evolução inteira: isso
          fica. Se o ano vencer, o acesso fecha e o histórico congela.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
          O que continua seu
        </div>
        <ul className="mt-4 space-y-2.5">
          {[
            'Raio-X e Coach ilimitados por mais 12 meses',
            'Seu histórico e sua evolução, sem reset',
            'Todo o arsenal que você já destravou, vitalício',
            'Preço de fidelidade: abaixo da faixa que os novos pagam',
          ].map((b) => (
            <li key={b} className="flex gap-2.5 text-[13.5px] text-muted-foreground leading-snug">
              <span className="text-primary font-bold shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
        <p className="font-serif-d text-3xl">
          Renovação de fidelidade: <span className="text-primary">R${RENOVACAO}</span>
        </p>
        <p className="font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
          mais 12 meses · PIX ou 12x no cartão
        </p>
        <div className="mt-5">
          <OfertaCliente
            oferta="renovacao"
            valor={RENOVACAO}
            cta={`Renovar por R$${RENOVACAO} →`}
            next="/dossiery/base"
            nota="1 clique no cartão salvo · ou PIX na hora"
          />
        </div>
      </div>

      <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
        Não quer renovar? Sem problema e sem cobrança automática: o acesso simplesmente encerra na
        data.{' '}
        <Link href="/dossiery/conta" className="underline underline-offset-4">
          Ver minha conta
        </Link>
      </p>
    </div>
  )
}
