import ModuloStub from '../components/ModuloStub'

export default function AcademiaPage() {
  return (
    <ModuloStub
      codigo="07 · A Biblioteca"
      titulo="Academia"
      subtitulo="O cânone, virado do avesso pra estudar"
      descricao="A base de conhecimento do RAG em formato navegável: trilhas por domínio — Inner Game, Carisma, Ciência da Atração, Conversa, Encontros, Relacionamento — cada princípio com um passo acionável, não só teoria."
      features={[
        'Trilhas curadas a partir de Manson, Glover, Cabane, Perel, Gottman, Carnegie e cia.',
        'Cada princípio com etiqueta de evidência (empírico / clínico / prático / filosófico).',
        'Drills práticos ligados às situações que você enfrenta na Arena e no Campo.',
        'Miolo manipulador (PUA/negging) só aparece como anti-pattern: "por que isso te sabota".',
      ]}
      fase="Fase 3"
    />
  )
}
