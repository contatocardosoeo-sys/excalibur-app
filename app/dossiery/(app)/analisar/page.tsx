import ModuloStub from '../components/ModuloStub'

export default function AnalisarPage() {
  return (
    <ModuloStub
      codigo="03 · Diagnóstico"
      titulo="Analisar"
      subtitulo="O raio-X da sua conversa"
      descricao="Cola o texto (ou sobe o print) de uma conversa sua. A IA lê o sinal dela, aponta onde você secou, apressou ou matou o clima — e devolve 2-3 respostas na SUA voz pra você editar. Nunca responde por você."
      features={[
        'Leitura do interesse percebido: reciprocidade, energia, sinais de avanço ou recuo.',
        'Diagnóstico direto: onde perdeu o timing, onde ficou carente, onde foi bem.',
        'Sugestões editáveis na sua voz — anti-"chatfishing", nunca ghost-writing.',
        'Salva em dossiery_interacoes pra medir sua evolução ao longo do tempo.',
      ]}
    />
  )
}
