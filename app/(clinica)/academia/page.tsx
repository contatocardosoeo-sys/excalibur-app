'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// ── Types ──────────────────────────────────────────────────────

interface Trilha {
  id: number
  titulo: string
  descricao: string
  aulas: number
  duracao: string
  progresso: number
  badge: string
  badgeCor: string
  emoji: string
}

interface Aula {
  id: number
  titulo: string
  duracao: string
  modulo: string
  concluida: boolean
  cor: string
}

interface Certificado {
  id: number
  titulo: string
  data: string
  codigo: string
}

interface Membro {
  id: number
  nome: string
  iniciais: string
  pontos: number
  certificados: number
  nivel: string
  nivelCor: string
  atual: boolean
}

// ── Mock Data ──────────────────────────────────────────────────

const trilhas: Trilha[] = [
  {
    id: 1,
    titulo: 'Vendas Odontológicas',
    descricao: 'Domine técnicas de vendas consultivas para converter mais pacientes e aumentar o ticket médio da clínica.',
    aulas: 8,
    duracao: '2h30',
    progresso: 75,
    badge: 'Essencial',
    badgeCor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emoji: '🎯',
  },
  {
    id: 2,
    titulo: 'Atendimento de Excelência',
    descricao: 'Transforme a experiência do paciente desde o primeiro contato até o pós-tratamento.',
    aulas: 6,
    duracao: '1h45',
    progresso: 40,
    badge: 'Recomendado',
    badgeCor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    emoji: '⭐',
  },
  {
    id: 3,
    titulo: 'Marketing para Clínicas',
    descricao: 'Estratégias de captação digital: tráfego pago, redes sociais e funis de conversão para odontologia.',
    aulas: 10,
    duracao: '3h',
    progresso: 15,
    badge: 'Avançado',
    badgeCor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    emoji: '📣',
  },
  {
    id: 4,
    titulo: 'Gestão Financeira',
    descricao: 'Controle fluxo de caixa, precificação de procedimentos e indicadores financeiros da sua clínica.',
    aulas: 7,
    duracao: '2h',
    progresso: 60,
    badge: 'Essencial',
    badgeCor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emoji: '💰',
  },
]

const aulasRecentes: Aula[] = [
  { id: 1, titulo: 'Técnicas de Fechamento', duracao: '18min', modulo: 'Vendas Odontológicas', concluida: false, cor: 'from-amber-600 to-amber-400' },
  { id: 2, titulo: 'Script de Primeiro Contato', duracao: '12min', modulo: 'Atendimento de Excelência', concluida: false, cor: 'from-blue-600 to-blue-400' },
  { id: 3, titulo: 'Facebook Ads para Dentistas', duracao: '25min', modulo: 'Marketing para Clínicas', concluida: false, cor: 'from-purple-600 to-purple-400' },
  { id: 4, titulo: 'Precificação Inteligente', duracao: '15min', modulo: 'Gestão Financeira', concluida: true, cor: 'from-green-600 to-green-400' },
  { id: 5, titulo: 'Objeções de Preço', duracao: '20min', modulo: 'Vendas Odontológicas', concluida: true, cor: 'from-amber-600 to-amber-400' },
]

const certificados: Certificado[] = [
  { id: 1, titulo: 'Vendas Odontológicas — Módulo Básico', data: '15/03/2026', codigo: 'EXC-2026-VB-0412' },
  { id: 2, titulo: 'Gestão Financeira — Fluxo de Caixa', data: '28/02/2026', codigo: 'EXC-2026-GF-0287' },
]

const ranking: Membro[] = [
  { id: 1, nome: 'Ana Carolina', iniciais: 'AC', pontos: 2850, certificados: 5, nivel: 'Expert', nivelCor: 'text-amber-400', atual: false },
  { id: 2, nome: 'Matheus Cardoso', iniciais: 'MC', pontos: 2340, certificados: 4, nivel: 'Expert', nivelCor: 'text-amber-400', atual: true },
  { id: 3, nome: 'Julia Santos', iniciais: 'JS', pontos: 1980, certificados: 3, nivel: 'Intermediário', nivelCor: 'text-blue-400', atual: false },
  { id: 4, nome: 'Pedro Lima', iniciais: 'PL', pontos: 1520, certificados: 2, nivel: 'Intermediário', nivelCor: 'text-blue-400', atual: false },
  { id: 5, nome: 'Fernanda Costa', iniciais: 'FC', pontos: 890, certificados: 1, nivel: 'Iniciante', nivelCor: 'text-gray-400', atual: false },
]

// ── Helpers ────────────────────────────────────────────────────

function positionMedal(pos: number): string {
  if (pos === 1) return '🥇'
  if (pos === 2) return '🥈'
  if (pos === 3) return '🥉'
  return `${pos}º`
}

// ── Component ──────────────────────────────────────────────────

export default function AcademiaPage() {
  const totalAulas = trilhas.reduce((s, t) => s + t.aulas, 0)
  const mediaProgresso = Math.round(trilhas.reduce((s, t) => s + t.progresso, 0) / trilhas.length)

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎓 Academia Excalibur
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Capacite sua equipe e domine cada etapa do crescimento da clínica
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-400 text-lg font-bold">{totalAulas}</p>
            <p className="text-gray-500 text-xs">Aulas</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-400 text-lg font-bold">{mediaProgresso}%</p>
            <p className="text-gray-500 text-xs">Progresso</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-400 text-lg font-bold">{certificados.length}</p>
            <p className="text-gray-500 text-xs">Certificados</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trilhas">
        <TabsList variant="line" className="border-b border-gray-800 pb-0">
          <TabsTrigger value="trilhas" className="text-gray-400 data-active:text-amber-400">
            📚 Trilhas
          </TabsTrigger>
          <TabsTrigger value="aulas" className="text-gray-400 data-active:text-amber-400">
            ▶️ Aulas Recentes
          </TabsTrigger>
          <TabsTrigger value="ranking" className="text-gray-400 data-active:text-amber-400">
            🏆 Certificados & Ranking
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Trilhas de Aprendizado ── */}
        <TabsContent value="trilhas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {trilhas.map((trilha) => (
              <div
                key={trilha.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{trilha.emoji}</span>
                    <div>
                      <h3 className="text-white font-semibold text-base">{trilha.titulo}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs">{trilha.aulas} aulas</span>
                        <span className="text-gray-700">•</span>
                        <span className="text-gray-500 text-xs">{trilha.duracao}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${trilha.badgeCor}`}>
                    {trilha.badge}
                  </span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {trilha.descricao}
                </p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progresso</span>
                    <span className="text-amber-400 font-semibold">{trilha.progresso}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${trilha.progresso}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-600 text-xs">
                    {Math.round(trilha.aulas * trilha.progresso / 100)}/{trilha.aulas} aulas concluídas
                  </span>
                  <button className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors">
                    {trilha.progresso > 0 ? 'Continuar →' : 'Iniciar →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 2: Aulas Recentes ── */}
        <TabsContent value="aulas">
          <div className="mt-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              ▶️ Continuar Assistindo
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
              {aulasRecentes.map((aula) => (
                <div
                  key={aula.id}
                  className="min-w-[260px] max-w-[280px] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors flex-shrink-0"
                >
                  {/* Thumbnail */}
                  <div className={`h-36 bg-gradient-to-br ${aula.cor} flex items-center justify-center relative`}>
                    <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      {aula.concluida ? (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                    {aula.concluida && (
                      <span className="absolute top-2 right-2 text-[10px] font-medium bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                        Concluída ✓
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h4 className="text-white font-medium text-sm leading-snug">{aula.titulo}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{aula.duracao}</span>
                      <span className="text-gray-700">•</span>
                      <span className="truncate">{aula.modulo}</span>
                    </div>
                    {!aula.concluida && (
                      <button className="mt-2 w-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-lg py-2 transition-colors">
                        Continuar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 3: Certificados & Ranking ── */}
        <TabsContent value="ranking">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Certificados */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                🎓 Seus Certificados
              </h2>

              {certificados.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-4 hover:border-amber-500/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏅</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm">{cert.titulo}</h4>
                    <p className="text-gray-500 text-xs mt-1">Emitido em {cert.data}</p>
                    <p className="text-gray-600 text-[10px] font-mono mt-0.5">{cert.codigo}</p>
                  </div>
                  <button className="text-amber-400 hover:text-amber-300 text-xs font-medium flex-shrink-0">
                    Ver →
                  </button>
                </div>
              ))}

              {certificados.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                  <span className="text-4xl">📜</span>
                  <p className="text-gray-500 text-sm mt-2">Nenhum certificado ainda. Complete uma trilha!</p>
                </div>
              )}
            </div>

            {/* Ranking */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                🏆 Ranking da Equipe
              </h2>

              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_80px_60px_100px] gap-2 px-4 py-3 border-b border-gray-800 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  <span>#</span>
                  <span>Nome</span>
                  <span className="text-right">Pontos</span>
                  <span className="text-center">Cert.</span>
                  <span className="text-right">Nível</span>
                </div>

                {/* Rows */}
                {ranking.map((membro, idx) => (
                  <div
                    key={membro.id}
                    className={`grid grid-cols-[40px_1fr_80px_60px_100px] gap-2 px-4 py-3 items-center border-b border-gray-800/50 last:border-0 transition-colors ${
                      membro.atual
                        ? 'bg-amber-500/5 border-l-2 border-l-amber-500'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-400">
                      {positionMedal(idx + 1)}
                    </span>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar size="sm">
                        <AvatarFallback className={membro.atual ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-400'}>
                          {membro.iniciais}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm truncate ${membro.atual ? 'text-amber-400 font-semibold' : 'text-white'}`}>
                        {membro.nome}
                        {membro.atual && <span className="text-amber-500/60 text-xs ml-1">(você)</span>}
                      </span>
                    </div>

                    <span className={`text-sm font-semibold text-right ${membro.atual ? 'text-amber-400' : 'text-white'}`}>
                      {membro.pontos.toLocaleString('pt-BR')}
                    </span>

                    <span className="text-sm text-gray-400 text-center">
                      {membro.certificados}
                    </span>

                    <span className={`text-xs font-medium text-right ${membro.nivelCor}`}>
                      {membro.nivel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
