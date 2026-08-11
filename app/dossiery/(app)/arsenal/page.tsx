import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import { paywallAtivo } from '@/app/lib/dossiery/assinatura'

export const dynamic = 'force-dynamic'

// ♠ Arsenal — hub central da esteira: tudo que ele tem e tudo que existe.
// Produto comprado → entra. Bloqueado → preço + destrave (cross-sell eterno).
export default async function ArsenalPage() {
  let e = {
    kit_aberturas: false,
    protocolo_encontro: false,
    plano_7d: false,
    perfil_magnetico: false,
    recomeco: false,
  }
  const aberto = !paywallAtivo()

  if (!aberto) {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/dossiery/entrar?next=/dossiery/arsenal')
    const { data } = await supabase
      .from('dossiery_assinaturas')
      .select('kit_aberturas, protocolo_encontro, plano_7d, perfil_magnetico, recomeco')
      .eq('user_id', user.id)
      .maybeSingle()
    if (data) e = { ...e, ...data }
  }

  const itens = [
    {
      href: '/dossiery/plano7',
      nome: 'Plano 7 Dias',
      desc: 'Bootcamp de entrada: 40 passos em 7 dias, do zero ao encontro proposto.',
      tem: aberto || e.plano_7d,
      preco: 'R$19',
    },
    {
      href: '/dossiery/kit',
      nome: 'Kit 50 Aberturas',
      desc: '50 mensagens de abertura que puxam resposta, por situação, com o porquê.',
      tem: aberto || e.kit_aberturas,
      preco: 'R$37',
    },
    {
      href: '/dossiery/encontro',
      nome: 'Protocolo Encontro',
      desc: '34 jogadas em 7 fases, do convite fechado ao segundo encontro.',
      tem: aberto || e.protocolo_encontro,
      preco: 'R$147',
    },
    {
      href: '/dossiery/perfil',
      nome: 'Perfil Magnético',
      desc: '37 ações pro perfil trabalhar por você 24/7: fotos, bio, stories, DM game.',
      tem: aberto || e.perfil_magnetico,
      preco: 'R$67',
    },
    {
      href: '/dossiery/recomeco',
      nome: 'Protocolo Recomeço',
      desc: '30 jogadas pra decidir a frio: voltar ou fechar o ciclo com dignidade.',
      tem: aberto || e.recomeco,
      preco: 'R$147',
    },
  ]

  const meus = itens.filter((i) => i.tem)
  const bloqueados = itens.filter((i) => !i.tem)

  return (
    <div className="mx-auto max-w-4xl px-6 md:px-10 py-10">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="font-mono-d text-[11px] tracking-[0.22em] uppercase text-[hsl(var(--brass))]">
            08 · Armário de guerra
          </div>
          <h1 className="font-serif-d text-4xl mt-2">Arsenal</h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="font-serif-d text-lg">
            {meus.length}/{itens.length}
          </div>
          <div className="font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground">
            destravados
          </div>
        </div>
      </div>

      {meus.length > 0 && (
        <div className="mt-8">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Seus · acesso vitalício
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {meus.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="group rounded-md border border-border bg-card p-5 hover:border-[hsl(var(--brass))] transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif-d text-lg group-hover:text-primary transition">
                    {i.nome}
                  </span>
                  <span className="grid place-items-center w-6 h-6 rounded-[3px] bg-[hsl(145_35%_28%)] text-[hsl(145_45%_70%)] text-[13px] font-bold shrink-0">
                    ✓
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-2">{i.desc}</p>
                <span className="inline-block mt-3 font-mono-d text-[10px] tracking-widest uppercase text-[hsl(var(--brass))]">
                  abrir →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {bloqueados.length > 0 && (
        <div className="mt-8">
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Bloqueados · destrave quando quiser
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {bloqueados.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="group rounded-md border border-border/60 bg-card/50 p-5 opacity-80 hover:opacity-100 hover:border-primary/60 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif-d text-lg">{i.nome}</span>
                  <span className="font-mono-d text-[11px] text-muted-foreground shrink-0">
                    🔒 {i.preco}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground mt-2">{i.desc}</p>
                <span className="inline-block mt-3 font-mono-d text-[10px] tracking-widest uppercase text-primary">
                  ver o que tem dentro →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
        ♠ todo produto aqui é vitalício: comprou uma vez, é seu pra sempre
      </p>
    </div>
  )
}
