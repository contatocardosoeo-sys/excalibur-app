'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Target, Percent,
  Brain, ChevronRight, RefreshCw, Calendar
} from 'lucide-react'

// ── Interfaces ──────────────────────────────────────────────────────
interface Lead {
  id: string
  etapa: string
  procedimento: string
  origem: string
  created_at: string
  valor: number
}

interface Proposta {
  id: string
  valor_total: number
  status: string
  created_at: string
}

// ── Constants ───────────────────────────────────────────────────────
const ETAPAS = ['Recebido', 'Contato feito', 'Agendado', 'Compareceu', 'Fechou']
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const PERIODOS = [
  { label: '7 dias', value: '7d', days: 7 },
  { label: '30 dias', value: '30d', days: 30 },
  { label: '90 dias', value: '90d', days: 90 },
  { label: '12 meses', value: '12m', days: 365 },
] as const

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']

const DEMO_LEADS: Lead[] = [
  { id: '1', etapa: 'Recebido', procedimento: 'Implante', origem: 'Instagram', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), valor: 5000 },
  { id: '2', etapa: 'Contato feito', procedimento: 'Protocolo', origem: 'Google', created_at: new Date(Date.now() - 5 * 86400000).toISOString(), valor: 12000 },
  { id: '3', etapa: 'Agendado', procedimento: 'Implante', origem: 'Indicação', created_at: new Date(Date.now() - 8 * 86400000).toISOString(), valor: 6000 },
  { id: '4', etapa: 'Compareceu', procedimento: 'Estética', origem: 'WhatsApp', created_at: new Date(Date.now() - 12 * 86400000).toISOString(), valor: 3500 },
  { id: '5', etapa: 'Fechou', procedimento: 'Implante', origem: 'Instagram', created_at: new Date(Date.now() - 15 * 86400000).toISOString(), valor: 8000 },
  { id: '6', etapa: 'Fechou', procedimento: 'Protocolo', origem: 'Google', created_at: new Date(Date.now() - 20 * 86400000).toISOString(), valor: 15000 },
  { id: '7', etapa: 'Recebido', procedimento: 'Prótese', origem: 'Outros', created_at: new Date(Date.now() - 25 * 86400000).toISOString(), valor: 4000 },
  { id: '8', etapa: 'Agendado', procedimento: 'Estética', origem: 'Instagram', created_at: new Date(Date.now() - 30 * 86400000).toISOString(), valor: 2500 },
  { id: '9', etapa: 'Compareceu', procedimento: 'Implante', origem: 'Indicação', created_at: new Date(Date.now() - 35 * 86400000).toISOString(), valor: 7000 },
  { id: '10', etapa: 'Fechou', procedimento: 'Prótese', origem: 'WhatsApp', created_at: new Date(Date.now() - 40 * 86400000).toISOString(), valor: 5500 },
  { id: '11', etapa: 'Contato feito', procedimento: 'Implante', origem: 'Google', created_at: new Date(Date.now() - 45 * 86400000).toISOString(), valor: 9000 },
  { id: '12', etapa: 'Fechou', procedimento: 'Protocolo', origem: 'Instagram', created_at: new Date(Date.now() - 50 * 86400000).toISOString(), valor: 18000 },
  { id: '13', etapa: 'Recebido', procedimento: 'Estética', origem: 'Google', created_at: new Date(Date.now() - 55 * 86400000).toISOString(), valor: 3000 },
  { id: '14', etapa: 'Agendado', procedimento: 'Implante', origem: 'Indicação', created_at: new Date(Date.now() - 60 * 86400000).toISOString(), valor: 6500 },
  { id: '15', etapa: 'Fechou', procedimento: 'Implante', origem: 'Instagram', created_at: new Date(Date.now() - 70 * 86400000).toISOString(), valor: 10000 },
]

const DEMO_PROPOSTAS: Proposta[] = [
  { id: '1', valor_total: 8000, status: 'pago', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: '2', valor_total: 15000, status: 'pago', created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: '3', valor_total: 5500, status: 'pago', created_at: new Date(Date.now() - 35 * 86400000).toISOString() },
  { id: '4', valor_total: 18000, status: 'aceita', created_at: new Date(Date.now() - 50 * 86400000).toISOString() },
  { id: '5', valor_total: 10000, status: 'pago', created_at: new Date(Date.now() - 65 * 86400000).toISOString() },
  { id: '6', valor_total: 6500, status: 'pendente', created_at: new Date(Date.now() - 80 * 86400000).toISOString() },
  { id: '7', valor_total: 12000, status: 'pago', created_at: new Date(Date.now() - 95 * 86400000).toISOString() },
  { id: '8', valor_total: 9000, status: 'pago', created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: '9', valor_total: 4500, status: 'aceita', created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: '10', valor_total: 7500, status: 'pago', created_at: new Date(Date.now() - 170 * 86400000).toISOString() },
]

// ── Helpers ─────────────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function fmtCompact(v: number) {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`
  return fmt(v)
}

const tooltipStyle = {
  contentStyle: { background: '#111827', border: '1px solid #374151', borderRadius: 12, fontSize: 12 },
  labelStyle: { color: '#9ca3af' },
  itemStyle: { color: '#f59e0b' },
}

// ── Custom Tooltip ──────────────────────────────────────────────────
interface TooltipPayloadItem {
  value: number
  name: string
  color: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || '#f59e0b' }}>
          {p.name}: {typeof p.value === 'number' && p.name?.includes('R$') ? fmt(p.value) : p.value.toLocaleString('pt-BR')}
        </p>
      ))}
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────
export default function BIPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<string>('90d')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [leadsRes, propostasRes] = await Promise.all([
      supabase.from('leads').select('id,etapa,procedimento,origem,created_at,valor'),
      supabase.from('propostas').select('id,valor_total,status,created_at'),
    ])
    const rawLeads = (leadsRes.data as Lead[] | null) ?? []
    const rawPropostas = (propostasRes.data as Proposta[] | null) ?? []
    setLeads(rawLeads.length > 0 ? rawLeads : DEMO_LEADS)
    setPropostas(rawPropostas.length > 0 ? rawPropostas : DEMO_PROPOSTAS)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Period filter ─────────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    const days = PERIODOS.find(p => p.value === periodo)?.days ?? 90
    const cutoff = Date.now() - days * 86400000
    return leads.filter(l => new Date(l.created_at).getTime() >= cutoff)
  }, [leads, periodo])

  const filteredPropostas = useMemo(() => {
    const days = PERIODOS.find(p => p.value === periodo)?.days ?? 90
    const cutoff = Date.now() - days * 86400000
    return propostas.filter(p => new Date(p.created_at).getTime() >= cutoff)
  }, [propostas, periodo])

  // ── KPIs ──────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalLeads = filteredLeads.length
    const fechados = filteredLeads.filter(l => l.etapa === 'Fechou').length
    const taxaConversao = totalLeads > 0 ? (fechados / totalLeads) * 100 : 0
    const receitaTotal = filteredPropostas
      .filter(p => p.status === 'pago' || p.status === 'aceita')
      .reduce((s, p) => s + Number(p.valor_total), 0)
    const ticketMedio = fechados > 0 ? receitaTotal / fechados : 0
    return { totalLeads, taxaConversao, receitaTotal, ticketMedio }
  }, [filteredLeads, filteredPropostas])

  // ── Receita Mensal (6 meses) ──────────────────────────────────────
  const receitaMensal = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const mes = MESES[m.getMonth()]
      const total = propostas
        .filter(p => {
          const d = new Date(p.created_at)
          return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear() && (p.status === 'pago' || p.status === 'aceita')
        })
        .reduce((s, p) => s + Number(p.valor_total), 0)
      return { mes, total }
    })
  }, [propostas])

  // ── Leads por Origem ──────────────────────────────────────────────
  const leadsPorOrigem = useMemo(() => {
    const origens = ['Instagram', 'Google', 'Indicação', 'WhatsApp', 'Outros']
    return origens.map(origem => ({
      origem,
      count: filteredLeads.filter(l => (l.origem || 'Outros') === origem).length,
    })).sort((a, b) => b.count - a.count)
  }, [filteredLeads])

  // ── Funil de Conversão ────────────────────────────────────────────
  const funil = useMemo(() => {
    const total = filteredLeads.length || 1
    return ETAPAS.map((etapa, i) => {
      const count = filteredLeads.filter(l => {
        const idx = ETAPAS.indexOf(l.etapa)
        return idx >= i
      }).length
      const pct = (count / total) * 100
      const prevCount = i === 0 ? total : filteredLeads.filter(l => ETAPAS.indexOf(l.etapa) >= i - 1).length
      const dropOff = prevCount > 0 ? ((prevCount - count) / prevCount) * 100 : 0
      return { etapa, count, pct, dropOff }
    })
  }, [filteredLeads])

  // ── Procedimentos por Volume ──────────────────────────────────────
  const procVolume = useMemo(() => {
    const map: Record<string, number> = {}
    filteredLeads.forEach(l => {
      const proc = l.procedimento || 'Outro'
      map[proc] = (map[proc] || 0) + 1
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredLeads])

  // ── Conversão Semanal ─────────────────────────────────────────────
  const conversaoSemanal = useMemo(() => {
    const weeks: { semana: string; leads: number; fechados: number; taxa: number }[] = []
    const now = Date.now()
    for (let w = 7; w >= 0; w--) {
      const start = now - (w + 1) * 7 * 86400000
      const end = now - w * 7 * 86400000
      const weekLeads = leads.filter(l => {
        const t = new Date(l.created_at).getTime()
        return t >= start && t < end
      })
      const total = weekLeads.length
      const fechados = weekLeads.filter(l => l.etapa === 'Fechou').length
      weeks.push({
        semana: `S${8 - w}`,
        leads: total,
        fechados,
        taxa: total > 0 ? Math.round((fechados / total) * 100) : 0,
      })
    }
    return weeks
  }, [leads])

  // ── Comparativo Mensal ────────────────────────────────────────────
  const comparativoMensal = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const metrics = ['Leads', 'Agendados', 'Compareceu', 'Fechou']
    const etapaMap: Record<string, string> = { Leads: '', Agendados: 'Agendado', Compareceu: 'Compareceu', Fechou: 'Fechou' }

    return metrics.map(metric => {
      const filterMonth = (month: number, year: number) => {
        return leads.filter(l => {
          const d = new Date(l.created_at)
          if (d.getMonth() !== month || d.getFullYear() !== year) return false
          if (metric === 'Leads') return true
          return l.etapa === etapaMap[metric]
        }).length
      }
      return {
        metric,
        atual: filterMonth(currentMonth, currentYear),
        anterior: filterMonth(prevMonth, prevYear),
      }
    })
  }, [leads])

  // ── IA Insight ────────────────────────────────────────────────────
  const iaInsight = useMemo(() => {
    const bestOrigem = leadsPorOrigem[0]
    const convRate = kpis.taxaConversao.toFixed(1)
    const bestProc = procVolume[0]
    const trend = receitaMensal.length >= 2
      ? receitaMensal[receitaMensal.length - 1].total > receitaMensal[receitaMensal.length - 2].total
        ? 'crescimento'
        : 'queda'
      : 'estável'

    return `A clínica apresenta ${trend} na receita mensal. A principal fonte de leads é "${bestOrigem?.origem}" com ${bestOrigem?.count} leads no período. A taxa de conversão geral está em ${convRate}%, e o procedimento mais procurado é "${bestProc?.name}" com ${bestProc?.value} leads. ${
      kpis.taxaConversao < 20
        ? 'Recomendação: investir em follow-up mais agressivo para aumentar conversão no funil.'
        : kpis.taxaConversao < 40
        ? 'A conversão está na média do mercado. Foco em otimizar a etapa de agendamento pode gerar ganhos significativos.'
        : 'Excelente taxa de conversão! Considere escalar os investimentos em captação mantendo a qualidade do atendimento.'
    }`
  }, [leadsPorOrigem, kpis, procVolume, receitaMensal])

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <span>⚔️</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-500 font-medium">BI & Análise</span>
          </div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            BI & Análise
          </h1>
          <p className="text-gray-400 text-sm mt-1">Inteligência de dados da clínica em tempo real</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
            {PERIODOS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  periodo === p.value
                    ? 'bg-amber-500 text-gray-950'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-amber-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="Total Leads"
          value={kpis.totalLeads.toLocaleString('pt-BR')}
          color="text-amber-400"
          bgIcon="bg-amber-500/10"
          sub={`no período de ${PERIODOS.find(p => p.value === periodo)?.label}`}
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="Taxa de Conversão"
          value={`${kpis.taxaConversao.toFixed(1)}%`}
          color={kpis.taxaConversao >= 20 ? 'text-green-400' : 'text-red-400'}
          bgIcon={kpis.taxaConversao >= 20 ? 'bg-green-500/10' : 'bg-red-500/10'}
          sub={kpis.taxaConversao >= 20 ? 'acima da média' : 'abaixo da meta'}
          trend={kpis.taxaConversao >= 20 ? 'up' : 'down'}
        />
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label="Receita Total"
          value={fmtCompact(kpis.receitaTotal)}
          color="text-green-400"
          bgIcon="bg-green-500/10"
          sub="propostas pagas/aceitas"
        />
        <KPICard
          icon={<Target className="w-5 h-5" />}
          label="Ticket Médio"
          value={fmt(kpis.ticketMedio)}
          color="text-blue-400"
          bgIcon="bg-blue-500/10"
          sub="por fechamento"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Carregando dados...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Row 1: Receita Mensal + Leads por Origem */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Receita Mensal */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Receita Mensal</h3>
                <span className="text-xs text-gray-500">Últimos 6 meses</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={receitaMensal}>
                  <defs>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                    formatter={(value) => [fmt(Number(value)), 'Receita']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} fill="url(#amberGradient)" name="R$ Receita" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Leads por Origem */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Leads por Origem</h3>
                <span className="text-xs text-gray-500">{filteredLeads.length} total</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leadsPorOrigem} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <YAxis type="category" dataKey="origem" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                    formatter={(value) => [Number(value), 'Leads']}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Funil de Conversão + Procedimentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Funil de Conversão */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Funil de Conversão</h3>
                <span className="text-xs text-gray-500">{filteredLeads.length} leads no funil</span>
              </div>
              <div className="space-y-3">
                {funil.map((f, i) => {
                  const maxWidth = 100
                  const width = Math.max(f.pct, 8)
                  const colors = [
                    'from-amber-500 to-amber-400',
                    'from-yellow-500 to-yellow-400',
                    'from-blue-500 to-blue-400',
                    'from-emerald-500 to-emerald-400',
                    'from-green-500 to-green-400',
                  ]
                  return (
                    <div key={f.etapa} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm font-medium">{f.etapa}</span>
                          <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                            {f.count}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-400 text-sm font-bold">{f.pct.toFixed(0)}%</span>
                          {i > 0 && f.dropOff > 0 && (
                            <span className="text-xs text-red-400 flex items-center gap-0.5">
                              <TrendingDown className="w-3 h-3" />
                              -{f.dropOff.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${colors[i]} h-full rounded-full transition-all duration-700`}
                          style={{ width: `${Math.min(width, maxWidth)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500">Drop-off total</span>
                <span className="text-sm font-semibold text-red-400">
                  {filteredLeads.length > 0
                    ? (100 - (filteredLeads.filter(l => l.etapa === 'Fechou').length / filteredLeads.length) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
            </div>

            {/* Procedimentos por Volume */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Procedimentos por Volume</h3>
                <span className="text-xs text-gray-500">distribuição</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={procVolume}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        strokeWidth={0}
                      >
                        {procVolume.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle.contentStyle}
                        labelStyle={tooltipStyle.labelStyle}
                        formatter={(value, name) => [Number(value), String(name)]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                  {procVolume.map((p, i) => {
                    const total = procVolume.reduce((s, x) => s + x.value, 0)
                    const pct = total > 0 ? ((p.value / total) * 100).toFixed(0) : '0'
                    return (
                      <div key={p.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-300 text-xs flex-1 truncate">{p.name}</span>
                        <span className="text-gray-400 text-xs font-semibold">{p.value}</span>
                        <span className="text-gray-500 text-xs">({pct}%)</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Conversão Semanal + Comparativo Mensal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Conversão Semanal */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Conversão Semanal</h3>
                <span className="text-xs text-gray-500">últimas 8 semanas</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={conversaoSemanal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="semana" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#6b7280' }} />
                  <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} name="Leads" />
                  <Line type="monotone" dataKey="fechados" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Fechados" />
                  <Line type="monotone" dataKey="taxa" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3b82f6', r: 3 }} name="Taxa %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Comparativo Mensal */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Comparativo Mensal</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-gray-400">Atual</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                    <span className="text-gray-400">Anterior</span>
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparativoMensal} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#374151' }} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                  />
                  <Bar dataKey="atual" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Mês Atual" />
                  <Bar dataKey="anterior" fill="#4b5563" radius={[6, 6, 0, 0]} name="Mês Anterior" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* IA Insight */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-amber-950/30 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl flex-shrink-0">
                <Brain className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-sm">Insight Excalibur IA</h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">BETA</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{iaInsight}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Análise gerada com base nos dados do período selecionado</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── KPI Card Component ──────────────────────────────────────────────
function KPICard({
  icon,
  label,
  value,
  color,
  bgIcon,
  sub,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bgIcon: string
  sub: string
  trend?: 'up' | 'down'
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${bgIcon}`}>
          <div className={color}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  )
}
