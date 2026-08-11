import type { Metadata } from 'next'
import OfertaCliente from '../../components/OfertaCliente'
import { PERFIL_MAGNETICO, TOTAL_ITENS_PERFIL } from '@/app/lib/dossiery/perfilMagnetico'

export const metadata: Metadata = {
  title: 'Só mais uma coisa: Perfil Magnético · Dossiery',
  robots: { index: false },
}

// ♠ OTO 2 — última oferta do funil pós-compra (depois do Encontro/downsell).
// Janela real de 60min no servidor (preço sobe pra R$67 dentro do app).
export default function Oto2PerfilPage() {
  return (
    <div className="min-h-screen d-grid-bg">
      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="text-center">
          <div className="font-mono-d text-[11px] tracking-[0.26em] uppercase text-primary">
            Última tela antes do seu acesso
          </div>
          <h1 className="font-serif-d text-4xl md:text-[42px] leading-[1.05] mt-4">
            Antes da primeira mensagem,
            <br />
            <span className="text-primary">ela vai olhar seu perfil.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
            Ela abre seu Instagram e decide em{' '}
            <span className="text-foreground">5 segundos</span> se responde. Selfie de banheiro e
            indireta de 2023 matam o papo antes do oi.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-[hsl(var(--brass)/0.5)] bg-card p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[hsl(var(--brass))]" />
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            Perfil Magnético · {TOTAL_ITENS_PERFIL} ações
          </div>
          <p className="font-serif-d text-[22px] mt-2 leading-snug">
            Seu Instagram aprovado na vistoria dos 5 segundos.
          </p>
          <ul className="mt-5 space-y-2.5">
            {PERFIL_MAGNETICO.map((g) => (
              <li key={g.grupo} className="flex gap-2.5 text-[13.5px] leading-snug">
                <span className="text-primary font-bold shrink-0">✓</span>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">{g.grupo}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-lg border-2 border-primary bg-primary/[0.06] p-6 text-center">
          <p className="text-[14px] text-muted-foreground">
            No app: <span className="line-through">R$67</span>.
          </p>
          <p className="font-serif-d text-3xl mt-1">
            Agora: <span className="text-primary">R$47</span>.
          </p>
          <div className="mt-5">
            <OfertaCliente
              oferta="perfil_oto"
              valor={47}
              cta="Adicionar o Perfil Magnético por R$47 →"
              next="/dossiery/bem-vindo"
              declineHref="/dossiery/bem-vindo"
              declineLabel="Meu perfil tá bom assim →"
              nota="1 clique no cartão salvo · PIX na hora"
            />
          </div>
        </div>

        <p className="mt-6 text-center font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Mesma garantia de 7 dias · acesso vitalício
        </p>
      </main>
    </div>
  )
}
