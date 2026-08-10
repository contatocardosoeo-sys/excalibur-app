import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso — Dossiery',
  robots: { index: false },
}

const SECOES: Array<{ t: string; c: React.ReactNode }> = [
  {
    t: '1. Quem somos',
    c: (
      <>
        O Dossiery é operado por <b>[RAZÃO SOCIAL]</b>, CNPJ <b>[CNPJ]</b>, com sede em{' '}
        <b>[ENDEREÇO]</b> (&quot;Dossiery&quot;, &quot;nós&quot;). Contato:{' '}
        <b>[E-MAIL DE SUPORTE]</b>.
      </>
    ),
  },
  {
    t: '2. O que é o serviço',
    c: (
      <>
        O Dossiery é uma plataforma de treinamento por inteligência artificial voltada ao
        desenvolvimento de habilidades sociais, de comunicação e de relacionamento do próprio
        usuário. O serviço analisa conteúdos enviados por você, gera orientações educacionais e
        oferece exercícios de treino. O Dossiery treina você — ele não envia mensagens a terceiros,
        não automatiza contas suas em outras plataformas e não interage com outras pessoas em seu
        nome.
      </>
    ),
  },
  {
    t: '3. Conta e elegibilidade',
    c: (
      <>
        O serviço é destinado a maiores de 18 anos. Você se compromete a fornecer dados verdadeiros,
        manter a confidencialidade das suas credenciais e usar uma conta individual. Podemos
        suspender contas em caso de violação destes Termos.
      </>
    ),
  },
  {
    t: '4. Planos, pagamento e renovação',
    c: (
      <>
        A assinatura é cobrada de forma recorrente (mensal ou anual) via Stripe, nosso processador
        de pagamentos. A renovação é automática até o cancelamento. Alterações de preço serão
        comunicadas com antecedência mínima de 30 dias e valem a partir do ciclo seguinte.
      </>
    ),
  },
  {
    t: '5. Garantia de 7 dias e reembolso',
    c: (
      <>
        Você tem <b>7 dias corridos</b> a partir da primeira contratação para solicitar reembolso
        integral, sem justificativa — pelo portal do assinante ou pelo e-mail de suporte. Após o
        prazo, o cancelamento interrompe renovações futuras, permanecendo o acesso até o fim do
        ciclo já pago. Este direito coexiste com o art. 49 do Código de Defesa do Consumidor.
      </>
    ),
  },
  {
    t: '6. Cancelamento',
    c: (
      <>
        Cancele a qualquer momento pelo portal do assinante (2 cliques) ou pelo suporte. Não há
        multa, fidelidade nem burocracia de retenção.
      </>
    ),
  },
  {
    t: '7. Uso aceitável',
    c: (
      <>
        É proibido usar o Dossiery para: assediar, perseguir ou importunar qualquer pessoa;
        contornar recusas manifestas de contato; produzir conteúdo discriminatório, difamatório ou
        ilegal; violar a privacidade de terceiros; ou tentar extrair táticas de manipulação
        psicológica. O sistema possui salvaguardas ativas e reservamo-nos o direito de encerrar,
        sem reembolso após o prazo de garantia, contas que violem esta cláusula.
      </>
    ),
  },
  {
    t: '8. Aviso sobre conteúdo de IA',
    c: (
      <>
        As respostas do Dossiery são geradas por inteligência artificial com finalidade{' '}
        <b>educacional e de treinamento</b>. Não constituem aconselhamento psicológico, médico,
        jurídico ou terapêutico, podem conter imprecisões e não garantem qualquer resultado
        específico nas suas relações pessoais — resultados dependem exclusivamente das suas ações e
        circunstâncias. Se você enfrenta sofrimento emocional significativo, procure um
        profissional de saúde qualificado.
      </>
    ),
  },
  {
    t: '9. Propriedade intelectual',
    c: (
      <>
        A marca, o design, os textos e o software do Dossiery são protegidos. Você mantém a
        titularidade do conteúdo que envia e nos licencia seu processamento exclusivamente para
        prestar o serviço. As orientações geradas para você podem ser usadas livremente na sua vida
        pessoal.
      </>
    ),
  },
  {
    t: '10. Privacidade',
    c: (
      <>
        O tratamento de dados pessoais é regido pela nossa{' '}
        <Link href="/dossiery/privacidade" className="text-[hsl(var(--brass))] hover:underline">
          Política de Privacidade
        </Link>
        , parte integrante destes Termos.
      </>
    ),
  },
  {
    t: '11. Limitação de responsabilidade',
    c: (
      <>
        Na máxima extensão permitida em lei, o Dossiery não responde por danos indiretos, lucros
        cessantes ou resultados esperados e não obtidos nas relações pessoais do usuário. Nossa
        responsabilidade total limita-se ao valor pago nos 12 meses anteriores ao evento.
      </>
    ),
  },
  {
    t: '12. Alterações e foro',
    c: (
      <>
        Podemos atualizar estes Termos, comunicando alterações relevantes com antecedência. Fica
        eleito o foro da comarca de <b>[CIDADE/UF]</b> para dirimir controvérsias, sem prejuízo do
        foro do domicílio do consumidor.
      </>
    ),
  },
]

export default function TermosPage() {
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
        <h1 className="font-serif-d text-4xl mt-3">Termos de Uso</h1>

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
          <Link href="/dossiery/privacidade" className="hover:text-[hsl(var(--brass))]">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </div>
  )
}
