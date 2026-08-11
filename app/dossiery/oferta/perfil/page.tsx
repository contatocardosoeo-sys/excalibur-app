import type { Metadata } from 'next'
import OfertaCliente from '../../components/OfertaCliente'
import { PERFIL_MAGNETICO, TOTAL_ITENS_PERFIL } from '@/app/lib/dossiery/perfilMagnetico'

export const metadata: Metadata = {
  title: 'Só mais uma coisa — Perfil Magnético · Dossiery',
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
            Última tela — depois disso, o funil acabou
          </div>
          <h1 className="font-serif-d text-4xl md:text-[42px] leading-[1.05] mt-4">
            Antes de você mandar a primeira mensagem…
            <br />
            <span className="text-primary">ela vai olhar seu perfil.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px] leading-relaxed max-w-md mx-auto">
            É o que toda mulher faz antes de responder: abre seu Instagram e decide em{' '}
            <span className="text-foreground">5 segundos</span> se você merece resposta. Selfie de
            banheiro, grade morta, indireta triste de 2023 — seu perfil pode estar matando
            conversas que você nem começou.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-[hsl(var(--brass)/0.5)] bg-card p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[hsl(var(--brass))]" />
          <div className="font-mono-d text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--brass))]">
            Perfil Magnético · {TOTAL_ITENS_PERFIL} ações
          </div>
          <p className="font-serif-d text-[22px] mt-2 leading-snug">
            O Instagram que trabalha por você 24/7 — antes, durante e depois do match.
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
            Dentro do app: <span className="line-through">R$67</span>.
          </p>
          <p className="font-serif-d text-3xl mt-1">
            Agora, junto com o pacote: <span className="text-primary">R$47</span>.
          </p>
          <div className="mt-5">
            <OfertaCliente
              oferta="perfil_oto"
              valor={47}
              cta="Adicionar o Perfil Magnético por R$47 →"
              next="/dossiery/bem-vindo"
              declineHref="/dossiery/bem-vindo"
              declineLabel="Não — meu perfil tá ok do jeito que tá →"
              nota="1 clique no cartão salvo · ou PIX na hora"
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
