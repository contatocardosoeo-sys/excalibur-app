import ModuloStub from '../components/ModuloStub'

export default function ConexoesPage() {
  return (
    <ModuloStub
      codigo="05 · CRM Pessoal"
      titulo="Conexões"
      subtitulo="Suas anotações privadas — e só suas"
      descricao="Suas conexões como fichas: apelido, onde conheceu, etapa, interesse percebido, suas notas. Enquadramento explícito: são as SUAS anotações privadas, com minimização de dados de terceiros por padrão. Nada de vigilância."
      features={[
        'Fichas com etapa e interesse percebido — seu funil pessoal, honesto.',
        'Notas suas + histórico das interações que você registrou.',
        'Isolamento total por RLS: user_id = auth.uid(). Ninguém vê o seu.',
        'Painel de privacidade: exporta ou apaga tudo quando quiser (LGPD).',
      ]}
      fase="Fase 2"
    />
  )
}
