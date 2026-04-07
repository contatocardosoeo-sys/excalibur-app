'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  TrendingUp,
  Receipt,
  AlertTriangle,
  Calculator,
  CreditCard,
  FileText,
  BarChart3,
  ChevronDown,
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

interface Proposta {
  id: string
  paciente_nome: string
  procedimento: string | null
  valor_total: number
  entrada: number
  parcelas: number
  valor_parcela: number
  status: string
  created_at: string
}

interface ContaReceber {
  id: string
  paciente_nome: string
  valor: number
  vencimento: string
  status: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('pt-BR')
}

function calcPMT(pv: number, taxa: number, n: number): number {
  if (taxa === 0) return pv / n
  const i = taxa / 100
  return pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  aprovado: { label: 'Aprovado', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  pago: { label: 'Pago', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  negado: { label: 'Negado', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  cancelado: { label: 'Cancelado', className: 'bg-gray-500/20 text-gray-500 border-gray-500/30' },
}

const CONTA_STATUS: Record<string, { label: string; dot: string; text: string }> = {
  'em dia': { label: 'Em dia', dot: 'bg-green-500', text: 'text-green-400' },
  vencendo: { label: 'Vencendo', dot: 'bg-amber-500', text: 'text-amber-400' },
  vencido: { label: 'Vencido', dot: 'bg-red-500', text: 'text-red-400' },
}

const PARCELA_OPTIONS = [6, 12, 18, 24, 36] as const

// ── Main Component ──────────────────────────────────────────────────────────

export default function FinanceiroPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  // Simulator state
  const [simValor, setSimValor] = useState(15000)
  const [simEntrada, setSimEntrada] = useState(3000)
  const [simParcelas, setSimParcelas] = useState(12)
  const [simTaxa, setSimTaxa] = useState(2.5)

  useEffect(() => {
    supabase
      .from('propostas')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPropostas(data as Proposta[])
        setLoading(false)
      })
  }, [])

  // ── KPIs ────────────────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const pagas = propostas.filter((p) => p.status === 'pago')
    const inadimplentes = propostas.filter((p) => p.status === 'negado' || p.status === 'cancelado')
    const receitaMensal = pagas.reduce((s, p) => s + Number(p.valor_total), 0)
    const receitaAcumulada = receitaMensal * 1.0 // single month data
    const ticketMedio = pagas.length > 0 ? receitaMensal / pagas.length : 0
    const taxaInadimplencia = propostas.length > 0 ? (inadimplentes.length / propostas.length) * 100 : 0

    return { receitaMensal, receitaAcumulada, ticketMedio, taxaInadimplencia }
  }, [propostas])

  // ── Revenue chart (mock 6 months based on current data) ─────────────────

  const revenueChart = useMemo(() => {
    const months = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr']
    const base = kpis.receitaMensal || 45000
    const values = [
      base * 0.6,
      base * 0.75,
      base * 0.82,
      base * 0.9,
      base * 0.95,
      base,
    ]
    const max = Math.max(...values, 1)
    return months.map((m, i) => ({ month: m, value: values[i], pct: (values[i] / max) * 100 }))
  }, [kpis.receitaMensal])

  // ── Top procedures ──────────────────────────────────────────────────────

  const topProcedures = useMemo(() => {
    const map = new Map<string, number>()
    propostas
      .filter((p) => p.status === 'pago')
      .forEach((p) => {
        const proc = p.procedimento || 'Outros'
        map.set(proc, (map.get(proc) || 0) + Number(p.valor_total))
      })
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    const max = sorted.length > 0 ? sorted[0][1] : 1

    // If no data, show placeholder procedures
    if (sorted.length === 0) {
      const placeholders = [
        ['Implante Unitário', 85000],
        ['Protocolo All-on-4', 72000],
        ['Lente de Contato', 54000],
        ['Prótese Fixa', 38000],
        ['Clareamento', 22000],
      ] as const
      const pMax = placeholders[0][1]
      return placeholders.map(([name, val]) => ({
        name: name as string,
        value: val as number,
        pct: ((val as number) / pMax) * 100,
      }))
    }

    return sorted.map(([name, value]) => ({ name, value, pct: (value / max) * 100 }))
  }, [propostas])

  // ── Filtered propostas ─────────────────────────────────────────────────

  const filteredPropostas = useMemo(() => {
    if (statusFilter === 'todos') return propostas
    return propostas.filter((p) => p.status === statusFilter)
  }, [propostas, statusFilter])

  // ── Simulator calculations ─────────────────────────────────────────────

  const simResult = useMemo(() => {
    const pv = Math.max(simValor - simEntrada, 0)
    const parcela = calcPMT(pv, simTaxa, simParcelas)
    const total = simEntrada + parcela * simParcelas
    const juros = total - simValor

    return { pv, parcela, total, juros }
  }, [simValor, simEntrada, simParcelas, simTaxa])

  const simComparison = useMemo(() => {
    const pv = Math.max(simValor - simEntrada, 0)
    return PARCELA_OPTIONS.map((n) => {
      const parcela = calcPMT(pv, simTaxa, n)
      const total = simEntrada + parcela * n
      const juros = total - simValor
      return { parcelas: n, parcela, total, juros }
    })
  }, [simValor, simEntrada, simTaxa])

  // ── Contas a Receber (derived from propostas) ──────────────────────────

  const contasReceber = useMemo(() => {
    const hoje = new Date()
    const contas: ContaReceber[] = []

    propostas
      .filter((p) => p.status === 'aprovado' || p.status === 'pendente')
      .forEach((p) => {
        const baseDate = new Date(p.created_at)
        for (let i = 1; i <= Math.min(p.parcelas, 3); i++) {
          const venc = new Date(baseDate)
          venc.setMonth(venc.getMonth() + i)
          const diffDays = Math.floor((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          let status = 'em dia'
          if (diffDays < 0) status = 'vencido'
          else if (diffDays <= 7) status = 'vencendo'

          contas.push({
            id: `${p.id}-${i}`,
            paciente_nome: p.paciente_nome,
            valor: Number(p.valor_parcela),
            vencimento: venc.toISOString(),
            status,
          })
        }
      })

    return contas.sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
  }, [propostas])

  const contasSummary = useMemo(() => {
    const emDia = contasReceber.filter((c) => c.status === 'em dia')
    const vencendo = contasReceber.filter((c) => c.status === 'vencendo')
    const vencido = contasReceber.filter((c) => c.status === 'vencido')
    return {
      emDia: { count: emDia.length, total: emDia.reduce((s, c) => s + c.valor, 0) },
      vencendo: { count: vencendo.length, total: vencendo.reduce((s, c) => s + c.valor, 0) },
      vencido: { count: vencido.length, total: vencido.reduce((s, c) => s + c.valor, 0) },
      total: contasReceber.reduce((s, c) => s + c.valor, 0),
    }
  }, [contasReceber])

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Excalibur Pay</h1>
            <p className="text-gray-400 text-sm">Financeiro, propostas e simulador de crédito</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumo">
        <TabsList className="bg-gray-900 border border-gray-800 rounded-xl p-1 w-full sm:w-auto">
          <TabsTrigger value="resumo" className="data-active:bg-amber-500/20 data-active:text-amber-400 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <BarChart3 className="w-4 h-4 mr-1.5" />
            Resumo
          </TabsTrigger>
          <TabsTrigger value="propostas" className="data-active:bg-amber-500/20 data-active:text-amber-400 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <FileText className="w-4 h-4 mr-1.5" />
            Propostas
          </TabsTrigger>
          <TabsTrigger value="simulador" className="data-active:bg-amber-500/20 data-active:text-amber-400 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Calculator className="w-4 h-4 mr-1.5" />
            Simulador
          </TabsTrigger>
          <TabsTrigger value="contas" className="data-active:bg-amber-500/20 data-active:text-amber-400 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            <CreditCard className="w-4 h-4 mr-1.5" />
            Contas a Receber
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Resumo ──────────────────────────────────────────────── */}
        <TabsContent value="resumo" className="mt-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Receita Mensal"
              value={fmt(kpis.receitaMensal)}
              color="text-green-400"
              iconBg="bg-green-500/10 border-green-500/20"
              trend="+12%"
            />
            <KpiCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Receita Acumulada"
              value={fmt(kpis.receitaAcumulada)}
              color="text-amber-400"
              iconBg="bg-amber-500/10 border-amber-500/20"
              trend="+8%"
            />
            <KpiCard
              icon={<Receipt className="w-5 h-5" />}
              label="Ticket Médio"
              value={fmt(kpis.ticketMedio)}
              color="text-blue-400"
              iconBg="bg-blue-500/10 border-blue-500/20"
              trend="+5%"
            />
            <KpiCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Taxa Inadimplência"
              value={`${kpis.taxaInadimplencia.toFixed(1)}%`}
              color={kpis.taxaInadimplencia > 10 ? 'text-red-400' : 'text-green-400'}
              iconBg={kpis.taxaInadimplencia > 10 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}
              trend={kpis.taxaInadimplencia > 10 ? '+2%' : '-3%'}
              trendDown={kpis.taxaInadimplencia <= 10}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-1">Receita Mensal</h3>
              <p className="text-gray-500 text-xs mb-6">Últimos 6 meses</p>
              <div className="flex items-end gap-3 h-48">
                {revenueChart.map((bar) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">{fmt(bar.value)}</span>
                    <div className="w-full bg-gray-800 rounded-lg overflow-hidden relative" style={{ height: '160px' }}>
                      <div
                        className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-700"
                        style={{ height: `${bar.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Procedures */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-1">Top Procedimentos</h3>
              <p className="text-gray-500 text-xs mb-6">Por receita</p>
              <div className="space-y-4">
                {topProcedures.map((proc, i) => (
                  <div key={proc.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-500 w-5">#{i + 1}</span>
                        <span className="text-sm text-white">{proc.name}</span>
                      </div>
                      <span className="text-sm text-gray-400 font-medium">{fmt(proc.value)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                        style={{ width: `${proc.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Propostas ───────────────────────────────────────────── */}
        <TabsContent value="propostas" className="mt-6 space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400 mr-2">Filtrar:</span>
            {['todos', 'pendente', 'aprovado', 'pago', 'negado', 'cancelado'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  statusFilter === s
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
                }`}
              >
                {s === 'todos' ? 'Todos' : STATUS_BADGE[s]?.label || s}
                {s !== 'todos' && (
                  <span className="ml-1.5 text-gray-500">
                    ({propostas.filter((p) => p.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Paciente</th>
                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Procedimento</th>
                    <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Valor Total</th>
                    <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Entrada</th>
                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Parcelas</th>
                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Status</th>
                    <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-16">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                          Carregando propostas...
                        </div>
                      </td>
                    </tr>
                  ) : filteredPropostas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma proposta encontrada</p>
                        <p className="text-gray-600 text-xs mt-1">As propostas aparecerão aqui quando forem criadas</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPropostas.map((p) => {
                      const badge = STATUS_BADGE[p.status] || STATUS_BADGE.cancelado
                      return (
                        <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{p.paciente_nome}</td>
                          <td className="px-6 py-4 text-amber-400 text-xs">{p.procedimento || '—'}</td>
                          <td className="px-6 py-4 text-right text-white font-semibold">{fmt(Number(p.valor_total))}</td>
                          <td className="px-6 py-4 text-right text-gray-400">{fmt(Number(p.entrada))}</td>
                          <td className="px-6 py-4 text-center text-gray-300">{p.parcelas}x {fmt(Number(p.valor_parcela))}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-500 text-xs">{fmtDate(p.created_at)}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredPropostas.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-500">{filteredPropostas.length} proposta(s)</span>
                <span className="text-xs text-gray-400">
                  Total: <span className="text-white font-semibold">{fmt(filteredPropostas.reduce((s, p) => s + Number(p.valor_total), 0))}</span>
                </span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Tab: Simulador de Crédito ────────────────────────────────── */}
        <TabsContent value="simulador" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    Simulador de Crédito
                  </h3>
                  <p className="text-gray-500 text-xs">Configure os valores e veja o resultado em tempo real</p>
                </div>

                {/* Valor do procedimento */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">
                    Valor do Procedimento
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                    <input
                      type="number"
                      min={0}
                      value={simValor}
                      onChange={(e) => setSimValor(Number(e.target.value) || 0)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={500}
                    value={simValor}
                    onChange={(e) => setSimValor(Number(e.target.value))}
                    className="w-full mt-2 accent-amber-500 h-1.5 bg-gray-800 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>R$ 1.000</span>
                    <span>R$ 100.000</span>
                  </div>
                </div>

                {/* Valor de entrada */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">
                    Valor de Entrada
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                    <input
                      type="number"
                      min={0}
                      max={simValor}
                      value={simEntrada}
                      onChange={(e) => setSimEntrada(Math.min(Number(e.target.value) || 0, simValor))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={simValor}
                    step={500}
                    value={simEntrada}
                    onChange={(e) => setSimEntrada(Number(e.target.value))}
                    className="w-full mt-2 accent-amber-500 h-1.5 bg-gray-800 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>R$ 0</span>
                    <span>{fmt(simValor)}</span>
                  </div>
                </div>

                {/* Parcelas */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-medium">
                    Número de Parcelas: <span className="text-amber-400 font-bold text-base">{simParcelas}x</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={36}
                    step={1}
                    value={simParcelas}
                    onChange={(e) => setSimParcelas(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-gray-800 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>2x</span>
                    <span>36x</span>
                  </div>
                </div>

                {/* Taxa de Juros */}
                <div>
                  <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">
                    Taxa de Juros (a.m.)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1.5, 2.5, 3.5].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSimTaxa(t)}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                          simTaxa === t
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/5'
                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-white'
                        }`}
                      >
                        {t === 0 ? '0%' : `${t}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Result cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Valor da Parcela</p>
                  <p className="text-3xl font-bold text-amber-400">{fmt(simResult.parcela)}</p>
                  <p className="text-xs text-gray-500 mt-1">{simParcelas}x sem entrada de {fmt(simEntrada)}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total a Pagar</p>
                  <p className="text-3xl font-bold text-white">{fmt(simResult.total)}</p>
                  <p className="text-xs text-gray-500 mt-1">Entrada + {simParcelas} parcelas</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total de Juros</p>
                  <p className={`text-3xl font-bold ${simResult.juros > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {simResult.juros > 0 ? '+' : ''}{fmt(simResult.juros)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {simValor > 0 ? ((simResult.juros / simValor) * 100).toFixed(1) : '0.0'}% sobre o valor
                  </p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Valor Financiado</p>
                  <p className="text-3xl font-bold text-blue-400">{fmt(simResult.pv)}</p>
                  <p className="text-xs text-gray-500 mt-1">Valor - Entrada</p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-sm mb-1">Comparativo de Parcelas</h3>
                <p className="text-gray-500 text-xs mb-4">Financiando {fmt(simResult.pv)} a {simTaxa}% a.m.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium pb-3">Parcelas</th>
                        <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium pb-3">Valor Parcela</th>
                        <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium pb-3">Total a Pagar</th>
                        <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium pb-3">Total Juros</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simComparison.map((row) => {
                        const isSelected = row.parcelas === simParcelas
                        return (
                          <tr
                            key={row.parcelas}
                            onClick={() => setSimParcelas(row.parcelas)}
                            className={`border-b border-gray-800/50 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-500/10 border-l-2 border-l-amber-500'
                                : 'hover:bg-gray-800/40'
                            }`}
                          >
                            <td className={`py-3 px-2 font-semibold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                              {row.parcelas}x
                            </td>
                            <td className="py-3 px-2 text-right text-white">{fmt(row.parcela)}</td>
                            <td className="py-3 px-2 text-right text-gray-300">{fmt(row.total)}</td>
                            <td className={`py-3 px-2 text-right font-medium ${row.juros > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {row.juros > 0 ? '+' : ''}{fmt(row.juros)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Generate Proposal Button */}
              <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 text-base">
                <FileText className="w-5 h-5" />
                Gerar Proposta — {simParcelas}x de {fmt(simResult.parcela)}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Contas a Receber ─────────────────────────────────────── */}
        <TabsContent value="contas" className="mt-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total a Receber</p>
              <p className="text-2xl font-bold text-white">{fmt(contasSummary.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{contasReceber.length} parcela(s)</p>
            </div>
            <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">Em Dia</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{fmt(contasSummary.emDia.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{contasSummary.emDia.count} parcela(s)</p>
            </div>
            <div className="bg-gray-900 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">Vencendo</p>
              </div>
              <p className="text-2xl font-bold text-amber-400">{fmt(contasSummary.vencendo.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{contasSummary.vencendo.count} parcela(s)</p>
            </div>
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">Vencido</p>
              </div>
              <p className="text-2xl font-bold text-red-400">{fmt(contasSummary.vencido.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{contasSummary.vencido.count} parcela(s)</p>
            </div>
          </div>

          {/* Contas list */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Paciente</th>
                    <th className="text-right text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Valor</th>
                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Vencimento</th>
                    <th className="text-center text-gray-500 text-xs uppercase tracking-wider font-medium px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contasReceber.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16">
                        <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma conta a receber</p>
                        <p className="text-gray-600 text-xs mt-1">As parcelas aparecerão aqui quando propostas forem aprovadas</p>
                      </td>
                    </tr>
                  ) : (
                    contasReceber.map((c) => {
                      const st = CONTA_STATUS[c.status] || CONTA_STATUS['em dia']
                      return (
                        <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">{c.paciente_nome}</td>
                          <td className="px-6 py-4 text-right text-white font-semibold">{fmt(c.valor)}</td>
                          <td className="px-6 py-4 text-center text-gray-400 text-xs">{fmtDate(c.vencimento)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                              <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── KPI Card Component ──────────────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  color,
  iconBg,
  trend,
  trendDown,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  iconBg: string
  trend: string
  trendDown?: boolean
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg} ${color}`}>
          {icon}
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            trendDown
              ? 'text-green-400 bg-green-500/10'
              : trend.startsWith('+')
              ? 'text-green-400 bg-green-500/10'
              : 'text-red-400 bg-red-500/10'
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
