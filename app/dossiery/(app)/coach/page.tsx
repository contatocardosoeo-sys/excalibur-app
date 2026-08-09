import ModuloStub from '../components/ModuloStub'

export default function CoachPage() {
  return (
    <ModuloStub
      codigo="02 · O Cérebro"
      titulo="Coach"
      subtitulo="A IA-coach treinada no cânone"
      descricao="Chat estilo terminal-dossiê. Você pergunta, treina uma ideia, pede leitura de uma situação — e a resposta sempre vem com o porquê, ancorada em ciência quando é 'o que funciona', citando o cânone."
      features={[
        'Streaming de respostas com raciocínio + citação da fonte ("segundo Models / Attached…").',
        'Lembra do seu perfil de atleta e do seu histórico pra calibrar o conselho.',
        'RAG (pgvector) recupera o princípio certo pra situação certa via taxonomia facetada.',
        'Classificador de ética roda antes do retrieval: bloqueia manipulação, redireciona pra auto-desenvolvimento.',
      ]}
    />
  )
}
