import ModuloStub from '../components/ModuloStub'

export default function ContaPage() {
  return (
    <ModuloStub
      codigo="09 · Cofre"
      titulo="Conta & Privacidade"
      subtitulo="Seu perfil de atleta, plano e controle de dados"
      descricao="Onde você mapeia o atleta (objetivo, arquétipo, forças, travas), gerencia o plano e controla seus dados. Transparência é parte da marca — exportar tudo e apagar tudo em um clique."
      features={[
        'Mapeamento do atleta: alimenta a personalização de toda a IA.',
        'Plano e billing (Stripe) — preço honesto, sem os dark patterns da categoria.',
        'Painel LGPD: exportar todos os seus dados, ou apagar a conta por completo.',
        'Preferências do coach: tom, intensidade do feedback, foco atual.',
      ]}
      fase="Fase 1"
    />
  )
}
