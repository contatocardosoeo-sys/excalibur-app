import ModuloStub from '../components/ModuloStub'

export default function ArenaPage() {
  return (
    <ModuloStub
      codigo="04 · A Forja"
      titulo="Practice Arena"
      subtitulo="Onde a habilidade é forjada"
      descricao="Roleplay com personas e cenários reais — primeira mensagem, silêncio na conversa, marcar o encontro, lidar com desinteresse. Feedback por mensagem e um heat-map no fim. É o antídoto pro 'travou no encontro sem a IA'."
      features={[
        'Cenários progressivos: do quebra-gelo ao convite, cada um com uma persona diferente.',
        'Feedback após cada mensagem: calibração, escuta, clareza, presença.',
        'Heat-map pós-sessão + nota, pra você ver o padrão e repetir a rep.',
        'Zero muleta em campo real: aqui você erra à vontade e aprende de verdade.',
      ]}
      fase="Fase 2"
    />
  )
}
