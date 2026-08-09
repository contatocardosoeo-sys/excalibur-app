import ModuloStub from '../components/ModuloStub'

export default function EvolucaoPage() {
  return (
    <ModuloStub
      codigo="08 · O Placar"
      titulo="Evolução"
      subtitulo="O único KPI que importa: você melhorando"
      descricao="Skill tree com XP por habilidade, streaks, missões e um gráfico de progresso. Gamifica competência real — o oposto do modelo de dependência dos concorrentes, que otimizam por frases consumidas."
      features={[
        'XP por habilidade: escuta, calibração, storytelling, presença, resiliência.',
        'Streaks e missões que puxam você pra prática deliberada.',
        'Gráfico de evolução (Recharts) cruzando Arena + Campo + Coach.',
        'Marcos que celebram o momento "a rodinha saiu da bicicleta".',
      ]}
      fase="Fase 3"
    />
  )
}
