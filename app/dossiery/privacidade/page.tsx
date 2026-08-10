import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Dossiery',
  robots: { index: false },
}

const SECOES: Array<{ t: string; c: React.ReactNode }> = [
  {
    t: '1. Controlador',
    c: (
      <>
        <b>[RAZÃO SOCIAL]</b>, CNPJ <b>[CNPJ]</b>. Encarregado (DPO) / canal de privacidade:{' '}
        <b>[E-MAIL DE PRIVACIDADE]</b>.
      </>
    ),
  },
  {
    t: '2. Dados que coletamos',
    c: (
      <>
        <b>Cadastro:</b> e-mail e senha (criptografada). <b>Conteúdo enviado:</b> textos que você
        cola para análise (conversas, contexto) e seu perfil de treino. <b>Pagamento:</b>{' '}
        processado integralmente pelo Stripe — não armazenamos dados de cartão. <b>Uso e
        analytics:</b> eventos de navegação via cookies e pixels (Meta, Google Analytics), quando
        ativos.
      </>
    ),
  },
  {
    t: '3. Conteúdo sobre terceiros',
    c: (
      <>
        As conversas que você envia podem citar terceiros. Trate-as como suas anotações privadas:
        recomendamos <b>omitir sobrenomes e dados identificadores</b> ao colar conversas. Usamos
        esse conteúdo exclusivamente para gerar a sua análise, não construímos perfis de terceiros
        e não enriquecemos esses dados com fontes externas.
      </>
    ),
  },
  {
    t: '4. Finalidades e bases legais (LGPD)',
    c: (
      <>
        Prestação do serviço e suporte (execução de contrato, art. 7º, V); melhoria do produto e
        prevenção a fraudes (legítimo interesse, art. 7º, IX); comunicações de marketing e pixels de
        publicidade (consentimento, art. 7º, I — revogável a qualquer momento); obrigações fiscais
        (cumprimento legal, art. 7º, II).
      </>
    ),
  },
  {
    t: '5. Compartilhamento (operadores)',
    c: (
      <>
        Compartilhamos dados apenas com os operadores necessários: <b>Stripe</b> (pagamentos),{' '}
        <b>Supabase</b> (banco de dados e autenticação), <b>Anthropic</b> (processamento de IA das
        análises), <b>Vercel</b> (hospedagem) e <b>Meta/Google</b> (métricas de anúncio, quando
        ativas). Não vendemos dados pessoais. Transferências internacionais seguem o art. 33 da
        LGPD.
      </>
    ),
  },
  {
    t: '6. Retenção e exclusão',
    c: (
      <>
        Mantemos seus dados enquanto a conta existir. Você pode <b>exportar</b> ou{' '}
        <b>apagar tudo</b> na área da conta (ou pelo canal de privacidade) — a exclusão remove
        conteúdo e perfil, preservando apenas registros fiscais exigidos por lei.
      </>
    ),
  },
  {
    t: '7. Seus direitos',
    c: (
      <>
        Nos termos do art. 18 da LGPD: confirmação de tratamento, acesso, correção, anonimização,
        portabilidade, eliminação, informação sobre compartilhamentos e revogação de consentimento.
        Basta escrever para o canal de privacidade; respondemos nos prazos legais.
      </>
    ),
  },
  {
    t: '8. Cookies e pixels',
    c: (
      <>
        Usamos cookies essenciais (sessão/login) e, quando configurados, pixels de métricas de
        anúncio (Meta Pixel, GA4) para medir o funil. Você pode bloquear cookies não essenciais no
        navegador; o serviço continua funcionando.
      </>
    ),
  },
  {
    t: '9. Segurança',
    c: (
      <>
        Criptografia em trânsito (TLS) e em repouso, isolamento de dados por usuário no banco
        (políticas de acesso por linha), segredos fora do código e princípio de menor privilégio.
        Nenhum sistema é infalível; incidentes relevantes serão comunicados conforme a LGPD.
      </>
    ),
  },
  {
    t: '10. Menores e alterações',
    c: (
      <>
        O serviço é proibido para menores de 18 anos. Alterações relevantes desta Política serão
        comunicadas por e-mail ou aviso na plataforma.
      </>
    ),
  },
]

export default function PrivacidadePage() {
  return (
    <div className="d-grid-bg min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <Link href="/dossiery" className="flex items-center gap-2 mb-10">
          <span className="text-primary text-lg leading-none">♠</span>
          <span className="font-serif-d text-xl tracking-tight">Dossiery</span>
        </Link>
        <div className="font-mono-d text-[11px] tracking-[0.24em] uppercase text-[hsl(var(--brass))]">
          Documento legal · vigente desde [DATA]
        </div>
        <h1 className="font-serif-d text-4xl mt-3">Política de Privacidade</h1>

        <div className="mt-4 rounded-md border border-[hsl(var(--brass)/0.4)] bg-[hsl(var(--brass)/0.06)] px-4 py-3 text-[12.5px] text-muted-foreground">
          Documento-modelo: os campos [ENTRE COLCHETES] devem ser preenchidos e o texto revisado
          por advogado antes do lançamento comercial.
        </div>

        <div className="mt-8 space-y-7">
          {SECOES.map((s) => (
            <section key={s.t}>
              <h2 className="font-serif-d text-lg text-foreground">{s.t}</h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mt-1.5">{s.c}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 font-mono-d text-[10px] tracking-widest uppercase text-muted-foreground/60 text-center">
          ♠ Dossiery ·{' '}
          <Link href="/dossiery/termos" className="hover:text-[hsl(var(--brass))]">
            Termos de Uso
          </Link>
        </p>
      </div>
    </div>
  )
}
