import ModuloStub from '../components/ModuloStub'

export default function ArenaPage() {
  return (
    <ModuloStub
      codigo="04 · A Forja"
      titulo="Arena de Treino"
      subtitulo="Onde a habilidade é forjada"
      descricao="Simulação com personas e cenários reais — primeira mensagem, silêncio na conversa, marcar o encontro, lidar com desinteresse. Feedback a cada mensagem e um mapa de calor no fim. Aqui você erra à vontade pra nunca mais travar lá fora."
      features={[
        'Cenários progressivos: do quebra-gelo ao convite, cada um com uma persona diferente.',
        'Feedback após cada mensagem: calibração, escuta, clareza, presença.',
        'Mapa de calor pós-sessão + nota, pra você ver o padrão e repetir a rep.',
        'Zero muleta em campo real: aqui você erra à vontade e aprende de verdade.',
      ]}
      fase="Fase 2"
    />
  )
}
