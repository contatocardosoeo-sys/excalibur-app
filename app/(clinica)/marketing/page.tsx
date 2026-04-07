'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Megaphone, Plus, TrendingUp, TrendingDown, DollarSign, Users,
  Target, Zap, Clock, ToggleLeft, ToggleRight, Globe,
  MessageCircle, UserPlus, ArrowRight, BarChart3, Filter,
  Eye, MousePointer, CalendarCheck, Handshake, Share2, Sparkles
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────

interface Lead {
  id: string
  origem: string | null
  created_at: string
}

type CampanhaStatus = 'ativa' | 'pausada' | 'finalizada'
type Plataforma = 'Meta Ads' | 'Google Ads' | 'WhatsApp'

interface Campanha {
  id: string
  nome: string
  plataforma: Plataforma
  status: CampanhaStatus
  budget: number
  leadsGerados: number
  cpl: number
  roi: number
  inicio: string
  fim: string | null
}

interface Automacao {
  id: string
  nome: string
  descricao: string
  trigger: string
  ativo: boolean
  ultimaExecucao: string
  execucoes: number
}

// ── Helpers ────────────────────────────────────────────────────────────

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function fmtNum(v: number) {
  return new Intl.NumberFormat('pt-BR').format(v)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Mock Data ──────────────────────────────────────────────────────────

const CAMPANHAS_MOCK: Campanha[] = [
  { id: '1', nome: 'Implantes Premium — Abril', plataforma: 'Meta Ads', status: 'ativa', budget: 8500, leadsGerados: 142, cpl: 59.86, roi: 3.2, inicio: '2026-04-01', fim: null },
  { id: '2', nome: 'Protocolo Dentário — Google', plataforma: 'Google Ads', status: 'ativa', budget: 12000, leadsGerados: 98, cpl: 122.45, roi: 4.1, inicio: '2026-03-15', fim: null },
  { id: '3', nome: 'Estética Dental — Reels', plataforma: 'Meta Ads', status: 'ativa', budget: 4200, leadsGerados: 87, cpl: 48.28, roi: 2.8, inicio: '2026-03-20', fim: null },
  { id: '4', nome: 'Reativação Base Fria', plataforma: 'WhatsApp', status: 'pausada', budget: 1500, leadsGerados: 34, cpl: 44.12, roi: 1.9, inicio: '2026-03-01', fim: null },
  { id: '5', nome: 'Lentes de Contato — Março', plataforma: 'Meta Ads', status: 'finalizada', budget: 6800, leadsGerados: 112, cpl: 60.71, roi: 3.5, inicio: '2026-03-01', fim: '2026-03-31' },
  { id: '6', nome: 'Clareamento Promo', plataforma: 'Google Ads', status: 'finalizada', budget: 3200, leadsGerados: 65, cpl: 49.23, roi: 2.4, inicio: '2026-02-15', fim: '2026-03-15' },
]

const AUTOMACOES_MOCK: Automacao[] = [
  { id: '1', nome: 'Boas-vindas novo lead', descricao: 'Envia mensagem de boas-vindas assim que o lead é captado', trigger: 'Lead criado no CRM', ativo: true, ultimaExecucao: '2026-04-07T10:32:00', execucoes: 328 },
  { id: '2', nome: 'Lembrete 24h antes da consulta', descricao: 'WhatsApp automático 24h antes do horário agendado', trigger: 'Agendamento -24h', ativo: true, ultimaExecucao: '2026-04-07T08:00:00', execucoes: 512 },
  { id: '3', nome: 'Follow-up pós-consulta D+7', descricao: 'Mensagem de acompanhamento 7 dias após a consulta', trigger: 'Consulta realizada +7d', ativo: true, ultimaExecucao: '2026-04-06T09:00:00', execucoes: 189 },
  { id: '4', nome: 'Reativação leads frios 30d', descricao: 'Contata leads sem interação há 30 dias com oferta especial', trigger: 'Última interação > 30d', ativo: false, ultimaExecucao: '2026-04-01T14:00:00', execucoes: 76 },
  { id: '5', nome: 'Pesquisa NPS D+30', descricao: 'Envia pesquisa de satisfação 30 dias após procedimento', trigger: 'Procedimento realizado +30d', ativo: true, ultimaExecucao: '2026-04-05T10:00:00', execucoes: 143 },
  { id: '6', nome: 'Aniversário do paciente', descricao: 'Parabenização automática no dia do aniversário', trigger: 'Data de nascimento = hoje', ativo: true, ultimaExecucao: '2026-04-07T07:00:00', execucoes: 94 },
]

const FUNIL_MOCK = [
  { etapa: 'Impressões', valor: 245000, icon: Eye },
  { etapa: 'Cliques', valor: 12800, icon: MousePointer },
  { etapa: 'Leads', valor: 538, icon: UserPlus },
  { etapa: 'Agendamentos', valor: 312, icon: CalendarCheck },
  { etapa: 'Fechamentos', valor: 187, icon: Handshake },
]

// ── Component ──────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [tab, setTab] = useState<'campanhas' | 'performance' | 'automacoes'>('campanhas')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [automacoes, setAutomacoes] = useState(AUTOMACOES_MOCK)

  // Form state
  const [formNome, setFormNome] = useState('')
  const [formPlataforma, setFormPlataforma] = useState<Plataforma>('Meta Ads')
  const [formBudget, setFormBudget] = useState('')

  useEffect(() => {
    supabase
      .from('leads')
      .select('id,origem,created_at')
      .then(({ data }) => {
        if (data) setLeads(data as Lead[])
        setLoading(false)
      })
  }, [])

  // Lead source distribution from real data
  const fontes = useMemo(() => {
    const map: Record<string, number> = {}
    leads.forEach(l => {
      const src = l.origem || 'Direto'
      map[src] = (map[src] || 0) + 1
    })
    // Merge with defaults to always show key sources
    const defaults = ['Instagram', 'Google Ads', 'Indicação', 'WhatsApp', 'Facebook']
    defaults.forEach(d => { if (!map[d]) map[d] = 0 })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [leads])

  const maxFonte = useMemo(() => Math.max(...fontes.map(f => f[1]), 1), [fontes])

  // Aggregated KPIs from mock campaigns
  const kpis = useMemo(() => {
    const totalInvestido = CAMPANHAS_MOCK.reduce((s, c) => s + c.budget, 0)
    const totalLeads = CAMPANHAS_MOCK.reduce((s, c) => s + c.leadsGerados, 0)
    const cplMedio = totalLeads > 0 ? totalInvestido / totalLeads : 0
    const roiMedio = CAMPANHAS_MOCK.length > 0
      ? CAMPANHAS_MOCK.reduce((s, c) => s + c.roi, 0) / CAMPANHAS_MOCK.length
      : 0
    return { totalInvestido, totalLeads, cplMedio, roiMedio }
  }, [])

  const statusColor: Record<CampanhaStatus, string> = {
    ativa: 'bg-green-500/20 text-green-400 border-green-500/30',
    pausada: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    finalizada: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  const statusLabel: Record<CampanhaStatus, string> = {
    ativa: 'Ativa',
    pausada: 'Pausada',
    finalizada: 'Finalizada',
  }

  const plataformaIcon: Record<Plataforma, typeof Megaphone> = {
    'Meta Ads': Sparkles,
    'Google Ads': Globe,
    'WhatsApp': MessageCircle,
  }

  function fonteIcon(nome: string) {
    if (nome.toLowerCase().includes('instagram')) return <Sparkles className="w-4 h-4 text-pink-400" />
    if (nome.toLowerCase().includes('google')) return <Globe className="w-4 h-4 text-blue-400" />
    if (nome.toLowerCase().includes('whatsapp')) return <MessageCircle className="w-4 h-4 text-green-400" />
    if (nome.toLowerCase().includes('facebook')) return <Share2 className="w-4 h-4 text-blue-500" />
    if (nome.toLowerCase().includes('indica')) return <Users className="w-4 h-4 text-purple-400" />
    return <UserPlus className="w-4 h-4 text-gray-400" />
  }

  function toggleAutomacao(id: string) {
    setAutomacoes(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a))
  }

  function handleSubmitCampanha(e: React.FormEvent) {
    e.preventDefault()
    // In production this would POST to an API / insert into Supabase
    setModalOpen(false)
    setFormNome('')
    setFormPlataforma('Meta Ads')
    setFormBudget('')
  }

  // ── Tab buttons ──────────────────────────────────────────────────────

  const tabs: { key: typeof tab; label: string; icon: typeof Megaphone }[] = [
    { key: 'campanhas', label: 'Campanhas', icon: Megaphone },
    { key: 'performance', label: 'Performance', icon: BarChart3 },
    { key: 'automacoes', label: 'Automações', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-amber-500" />
            Marketing & Campanhas
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie campanhas, acompanhe performance e automatize comunicações</p>
        </div>
        {tab === 'campanhas' && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl w-fit">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ─── TAB: CAMPANHAS ─────────────────────────────────────────── */}
      {tab === 'campanhas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CAMPANHAS_MOCK.map(c => {
            const Icon = plataformaIcon[c.plataforma]
            return (
              <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 hover:border-gray-700 transition-colors">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">{c.nome}</h3>
                      <span className="text-gray-500 text-xs">{c.plataforma}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">Budget</p>
                    <p className="text-white font-semibold text-sm">{fmt(c.budget)}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">Leads</p>
                    <p className="text-white font-semibold text-sm">{fmtNum(c.leadsGerados)}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">CPL</p>
                    <p className="text-amber-400 font-semibold text-sm">{fmt(c.cpl)}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">ROI</p>
                    <p className={`font-semibold text-sm ${c.roi >= 3 ? 'text-green-400' : c.roi >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
                      {c.roi.toFixed(1)}x
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <span className="text-gray-500 text-xs">
                    {fmtDate(c.inicio)}{c.fim ? ` — ${fmtDate(c.fim)}` : ' — em andamento'}
                  </span>
                  <button className="text-amber-500 hover:text-amber-400 text-xs font-medium flex items-center gap-1 transition-colors">
                    Detalhes <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── TAB: PERFORMANCE ───────────────────────────────────────── */}
      {tab === 'performance' && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Investido', value: fmt(kpis.totalInvestido), icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Leads Gerados', value: fmtNum(kpis.totalLeads), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'CPL Médio', value: fmt(kpis.cplMedio), icon: Target, color: 'text-green-400', bg: 'bg-green-500/10' },
              { label: 'ROI Geral', value: `${kpis.roiMedio.toFixed(1)}x`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map(kpi => {
              const Icon = kpi.icon
              return (
                <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">{kpi.label}</span>
                    <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                  </div>
                  <p className="text-white text-2xl font-bold">{kpi.value}</p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart — Leads por Fonte */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                Leads por Fonte
                {loading && <span className="text-xs text-gray-500 ml-2">Carregando...</span>}
              </h3>
              <div className="space-y-3">
                {fontes.map(([nome, count]) => (
                  <div key={nome} className="flex items-center gap-3">
                    {fonteIcon(nome)}
                    <span className="text-gray-300 text-sm w-24 shrink-0 truncate">{nome}</span>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500/80 to-amber-500 rounded-lg transition-all duration-700"
                        style={{ width: `${Math.max((count / maxFonte) * 100, 2)}%` }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                        {fmtNum(count)}
                      </span>
                    </div>
                  </div>
                ))}
                {fontes.length === 0 && !loading && (
                  <p className="text-gray-500 text-sm text-center py-6">Nenhum lead encontrado</p>
                )}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-500" />
                Funil de Conversão
              </h3>
              <div className="space-y-3">
                {FUNIL_MOCK.map((step, i) => {
                  const pct = (step.valor / FUNIL_MOCK[0].valor) * 100
                  const convRate = i > 0 ? ((step.valor / FUNIL_MOCK[i - 1].valor) * 100).toFixed(1) : '100'
                  const Icon = step.icon
                  return (
                    <div key={step.etapa}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{step.etapa}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold text-sm">{fmtNum(step.valor)}</span>
                          {i > 0 && (
                            <span className="text-xs text-gray-500">{convRate}%</span>
                          )}
                        </div>
                      </div>
                      <div className="h-6 bg-gray-800 rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${
                              i === 0 ? '#6366f1' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : i === 3 ? '#22c55e' : '#a855f7'
                            }cc, ${
                              i === 0 ? '#6366f1' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : i === 3 ? '#22c55e' : '#a855f7'
                            })`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Custo de Aquisição por Campanha
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">Campanha</th>
                    <th className="text-left text-gray-400 font-medium pb-3 pr-4">Plataforma</th>
                    <th className="text-right text-gray-400 font-medium pb-3 pr-4">Investido</th>
                    <th className="text-right text-gray-400 font-medium pb-3 pr-4">Leads</th>
                    <th className="text-right text-gray-400 font-medium pb-3 pr-4">CPL</th>
                    <th className="text-right text-gray-400 font-medium pb-3">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPANHAS_MOCK.map(c => (
                    <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.status === 'ativa' ? 'bg-green-500' : c.status === 'pausada' ? 'bg-amber-500' : 'bg-gray-500'}`} />
                          <span className="text-white">{c.nome}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{c.plataforma}</td>
                      <td className="py-3 pr-4 text-right text-white">{fmt(c.budget)}</td>
                      <td className="py-3 pr-4 text-right text-white">{fmtNum(c.leadsGerados)}</td>
                      <td className="py-3 pr-4 text-right text-amber-400 font-medium">{fmt(c.cpl)}</td>
                      <td className="py-3 text-right">
                        <span className={`font-medium ${c.roi >= 3 ? 'text-green-400' : c.roi >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
                          {c.roi.toFixed(1)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-700">
                    <td className="py-3 pr-4 text-white font-semibold">Total</td>
                    <td className="py-3 pr-4" />
                    <td className="py-3 pr-4 text-right text-white font-semibold">{fmt(kpis.totalInvestido)}</td>
                    <td className="py-3 pr-4 text-right text-white font-semibold">{fmtNum(kpis.totalLeads)}</td>
                    <td className="py-3 pr-4 text-right text-amber-400 font-semibold">{fmt(kpis.cplMedio)}</td>
                    <td className="py-3 text-right text-green-400 font-semibold">{kpis.roiMedio.toFixed(1)}x</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: AUTOMACOES ────────────────────────────────────────── */}
      {tab === 'automacoes' && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total de Fluxos', value: automacoes.length.toString(), color: 'text-amber-500' },
              { label: 'Ativos', value: automacoes.filter(a => a.ativo).length.toString(), color: 'text-green-400' },
              { label: 'Inativos', value: automacoes.filter(a => !a.ativo).length.toString(), color: 'text-gray-400' },
              { label: 'Execuções Total', value: fmtNum(automacoes.reduce((s, a) => s + a.execucoes, 0)), color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Automation list */}
          <div className="space-y-3">
            {automacoes.map(a => (
              <div
                key={a.id}
                className={`bg-gray-900 border rounded-2xl p-5 transition-colors ${
                  a.ativo ? 'border-gray-800 hover:border-gray-700' : 'border-gray-800/50 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      a.ativo ? 'bg-amber-500/10' : 'bg-gray-800'
                    }`}>
                      <Zap className={`w-5 h-5 ${a.ativo ? 'text-amber-500' : 'text-gray-500'}`} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-semibold text-sm">{a.nome}</h3>
                      <p className="text-gray-400 text-xs">{a.descricao}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Target className="w-3 h-3" /> {a.trigger}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Última: {fmtDate(a.ultimaExecucao)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {fmtNum(a.execucoes)} execuções
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <button
                      onClick={() => toggleAutomacao(a.id)}
                      className="flex items-center gap-2 transition-colors"
                    >
                      {a.ativo ? (
                        <>
                          <ToggleRight className="w-8 h-8 text-green-500" />
                          <span className="text-green-400 text-xs font-medium">Ativo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-8 h-8 text-gray-600" />
                          <span className="text-gray-500 text-xs font-medium">Inativo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL: NOVA CAMPANHA ───────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 space-y-5">
            <div>
              <h2 className="text-white text-lg font-bold">Nova Campanha</h2>
              <p className="text-gray-400 text-sm mt-1">Configure os dados iniciais da campanha</p>
            </div>
            <form onSubmit={handleSubmitCampanha} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1.5">Nome da Campanha</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={e => setFormNome(e.target.value)}
                  placeholder="Ex: Implantes Premium — Abril"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1.5">Plataforma</label>
                <select
                  value={formPlataforma}
                  onChange={e => setFormPlataforma(e.target.value as Plataforma)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors appearance-none"
                >
                  <option value="Meta Ads">Meta Ads (Instagram/Facebook)</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1.5">Budget Mensal (R$)</label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={e => setFormBudget(e.target.value)}
                  placeholder="5000"
                  required
                  min={0}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Criar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
