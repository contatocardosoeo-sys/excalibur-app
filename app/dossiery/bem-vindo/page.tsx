import Link from 'next/link'
import { Suspense } from 'react'
import { createSupabaseServer } from '@/app/lib/supabase-server'
import CompraTrack from './CompraTrack'

export const dynamic = 'force-dynamic'

// ♠ Fim do funil: confirma a compra e mostra o arsenal que ele destravou.
export default async function BemVindoPage() {
  let e = { kit_aberturas: false, protocolo_encontro: false, perfil_magnetico: false, recomeco: false }
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('dossiery_assinaturas')
        .select('kit_aberturas, protocolo_encontro, perfil_magnetico, recomeco')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data) e = { ...e, ...data }
    }
  } catch {
    /* sem env/sessão → mostra o padrão */
  }

  const naoIncluido = 'não incluído: destrave no app'
  const vitalicio = 'liberado: acesso vitalício'
  const arsenal = [
    { ok: true, t: 'Plano Operador', d: 'Raio-X + Coach + Campo, ilimitados', href: '/dossiery/base' },
    { ok: e.kit_aberturas, t: 'Kit 50 Aberturas', d: e.kit_aberturas ? vitalicio : naoIncluido, href: '/dossiery/kit' },
    { ok: e.protocolo_encontro, t: 'Protocolo Encontro', d: e.protocolo_encontro ? vitalicio : naoIncluido, href: '/dossiery/encontro' },
    { ok: e.perfil_magnetico, t: 'Perfil Magnético', d: e.perfil_magnetico ? vitalicio : naoIncluido, href: '/dossiery/perfil' },
    { ok: e.recomeco, t: 'Protocolo Recomeço', d: e.recomeco ? vitalicio : naoIncluido, href: '/dossiery/recomeco' },
  ]

  return (
    <div className="min-h-screen d-grid-bg grid place-items-center px-6 py-12">
      <Suspense fallback={null}>
        <CompraTrack />
      </Suspense>
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid place-items-center w-20 h-20 rounded-full border border-[hsl(var(--brass))] text-[hsl(var(--brass))] relative">
          <span className="absolute inset-[7px] rounded-full border border-dashed border-[hsl(var(--brass)/0.5)]" />
          <span className="font-serif-d text-3xl">♠</span>
        </div>
        <div className="mt-6 font-mono-d text-[11px] tracking-[0.26em] uppercase text-[hsl(var(--brass))]">
          Pagamento confirmado
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Bem-vindo ao arsenal, Operador.</h1>
        <p className="text-muted-foreground mt-4 text-[14.5px] leading-relaxed">
          Cartão libera na hora. PIX abre 1-2 minutos depois da transferência cair. Seu arsenal
          está listado abaixo.
        </p>

        {/* o que ele destravou */}
        <div className="mt-7 space-y-2 text-left">
          {arsenal.map((a) => (
            <Link
              key={a.t}
              href={a.href}
              className={`flex items-center gap-3 rounded-md border p-3.5 transition ${
                a.ok
                  ? 'border-border bg-card hover:border-[hsl(var(--brass))]'
                  : 'border-border/60 bg-card/50 opacity-70 hover:opacity-100 hover:border-border'
              }`}
            >
              <span
                className={`grid place-items-center w-6 h-6 rounded-[3px] text-[13px] font-bold shrink-0 ${
                  a.ok
                    ? 'bg-[hsl(145_35%_28%)] text-[hsl(145_45%_70%)]'
                    : 'border border-muted-foreground/40 text-muted-foreground/50'
                }`}
              >
                {a.ok ? '✓' : '🔒'}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] text-foreground font-medium">{a.t}</span>
                <span className="block text-[12px] text-muted-foreground truncate">{a.d}</span>
              </span>
              <span className="text-muted-foreground text-sm">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/dossiery/coach"
            className="rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 hover:opacity-90 transition"
          >
            Falar com o Coach agora →
          </Link>
          <Link
            href="/dossiery/base"
            className="rounded-[4px] border border-border text-[14px] py-3 hover:border-primary hover:text-primary transition"
          >
            Ir para a Base
          </Link>
        </div>
        <p className="mt-6 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Garantia de 7 dias · qualquer coisa, fala com a gente
        </p>
      </div>
    </div>
  )
}
