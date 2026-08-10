import ModuloStub from '../components/ModuloStub'

export default function CampoPage() {
  return (
    <ModuloStub
      codigo="06 · Diário de Campo"
      titulo="Campo"
      subtitulo="Fecha o ciclo treino → vida real"
      descricao="Teve uma interação real? Registra aqui. A IA faz o debrief: o que foi bem, a lição, a próxima rep. É a ponte entre o treino e a rua — a resposta direta pra crítica de 'déficit de habilidade social' dos apps concorrentes."
      features={[
        'Log rápido: contexto, o que rolou, como você se sentiu, resultado.',
        'Debrief da IA: reforça o acerto, nomeia a lição, define a próxima rep.',
        'Timeline da sua evolução real, não de gerações consumidas.',
        'Alimenta a Evolução (XP por habilidade) com dados da vida real.',
      ]}
      fase="Fase 2"
    />
  )
}
