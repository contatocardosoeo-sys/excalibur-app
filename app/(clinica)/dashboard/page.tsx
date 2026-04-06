'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Lead { id: string; nome: string; telefone: string; etapa: string; procedimento: string; created_at: string }
interface Proposta { id: string; valor_total: number; status: string; created_at: string }

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }

function timeAgo(dt: string) {
  const diff = Date.now() - new Date(dt).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}min`
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [chartFilter, setChartFilter] = useState<'todos' | 'receitas' | 'despesas' | 'lucro'>('todos')

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('id,nome,telefone,etapa,procedimento,created_at').order('created_at', { ascending: false }),
      supabase.from('propostas').select('id,valor_total,status,created_at').order('created_at', { ascending: false }),
    ]).then(([l, p]) => {
      if (l.data) setLeads(l.data as Lead[])
      if (p.data) setPropostas(p.data as Proposta[])
      setLoading(false)
    })

    const ch = supabase.channel('dashboard-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        supabase.from('leads').select('id,nome,telefone,etapa,procedimento,created_at').order('created_at', { ascending: false }).then(r => { if (r.data) setLeads(r.data as Lead[]) })
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'propostas' }, () => {
        supabase.from('propostas').select('id,valor_total,status,created_at').order('created_at', { ascending: false }).then(r => { if (r.data) setPropostas(r.data as Proposta[]) })
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const kpis = useMemo(() => {
    const now = new Date()
    const mesAtual = now.getMonth()
    const anoAtual = now.getFullYear()
    const leadsMes = leads.filter(l => { const d = new Date(l.created_at); return d.getMonth() === mesAtual && d.getFullYear() === anoAtual })
    const propostasMes = propostas.filter(p => { const d = new Date(p.created_at); return d.getMonth() === mesAtual && d.getFullYear() === anoAtual })
    const receita = propostasMes.filter(p => p.status === 'pago' || p.status === 'aceita').reduce((s, p) => s + Number(p.valor_total), 0)
    const fechados = leads.filter(l => l.etapa === 'Fechou').length
    const taxa = leads.length > 0 ? Math.round((fechados / leads.length) * 100) : 0
    return { receita, novosLeads: leadsMes.length, propostas: propostasMes.length, taxa }
  }, [leads, propostas])

  const alertas = useMemo(() => {
    const threshold = Date.now() - 24 * 3600000
    return leads.filter(l => new Date(l.created_at).getTime() < threshold && !['Fechou', 'Compareceu'].includes(l.etapa)).slice(0, 5)
  }, [leads])

  const atividades = useMemo(() => {
    const all: { tipo: string; desc: string; tempo: string }[] = []
    leads.slice(0, 5).forEach(l => all.push({ tipo: 'lead', desc: `Lead "${l.nome}" criado`, tempo: timeAgo(l.created_at) }))
    propostas.slice(0, 3).forEach(p => all.push({ tipo: 'proposta', desc: `Proposta ${fmt(Number(p.valor_total))} — ${p.status}`, tempo: timeAgo(p.created_at) }))
    return all.slice(0, 8)
  }, [leads, propostas])

  // Simulated chart data (5 months)
  const chartData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 5 }, (_, i) => {
      const m = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1)
      const mesLabel = MESES[m.getMonth()]
      const mesPropostas = propostas.filter(p => {
        const d = new Date(p.created_at)
        return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear()
      })
      const rec = mesPropostas.filter(p => p.status === 'pago' || p.status === 'aceita').reduce((s, p) => s + Number(p.valor_total), 0)
      const desp = rec * 0.35
      return { mes: mesLabel, receitas: rec, despesas: desp, lucro: rec - desp }
    })
  }, [propostas])

  const maxChart = Math.max(...chartData.map(d => Math.max(d.receitas, d.despesas, d.lucro)), 1)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-amber-500 font-bold">⚔️</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input type="text" placeholder="Buscar pacientes, leads..." className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 w-64 focus:outline-none focus:border-amber-500/50" />
              <kbd className="absolute right-2 top-1.5 text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              {alertas.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{alertas.length}</span>}
            </button>
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-950 font-bold text-sm">M</div>
          </div>
        </header>

        <div className="p-6">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold">Dashboard da Clínica</h2>
            <p className="text-gray-500 text-sm mt-1">Resumo geral em tempo real • Atualização automática via Supabase Realtime</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard label="Receitas do Mês" valor={fmt(kpis.receita)} variacao="+12.5%" positivo cor="text-green-400" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            <KpiCard label="Novos Leads" valor={String(kpis.novosLeads)} variacao={kpis.novosLeads > 0 ? `+${kpis.novosLeads}` : '0'} positivo={kpis.novosLeads > 0} cor="text-amber-400" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            <KpiCard label="Propostas" valor={String(kpis.propostas)} variacao={kpis.propostas > 0 ? `${kpis.propostas} este mês` : 'nenhuma'} positivo={kpis.propostas > 0} cor="text-blue-400" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <KpiCard label="Taxa Conversão" valor={`${kpis.taxa}%`} variacao={kpis.taxa > 50 ? 'saudável' : 'melhorar'} positivo={kpis.taxa > 50} cor={kpis.taxa > 50 ? 'text-green-400' : 'text-red-400'} icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </div>

          {/* Chart + Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Evolução Financeira</h3>
                <p className="text-gray-500 text-xs mt-0.5">Performance dos últimos 5 meses</p>
              </div>
              <div className="flex gap-1">
                {(['todos', 'receitas', 'despesas', 'lucro'] as const).map(f => (
                  <button key={f} onClick={() => setChartFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${chartFilter === f ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end gap-3 h-40 mt-4">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end justify-center h-32">
                    {(chartFilter === 'todos' || chartFilter === 'receitas') && (
                      <div className="w-3 bg-green-500/60 rounded-t transition-all" style={{ height: `${(d.receitas / maxChart) * 100}%`, minHeight: d.receitas > 0 ? 4 : 0 }} />
                    )}
                    {(chartFilter === 'todos' || chartFilter === 'despesas') && (
                      <div className="w-3 bg-red-500/60 rounded-t transition-all" style={{ height: `${(d.despesas / maxChart) * 100}%`, minHeight: d.despesas > 0 ? 4 : 0 }} />
                    )}
                    {(chartFilter === 'todos' || chartFilter === 'lucro') && (
                      <div className="w-3 bg-amber-500/60 rounded-t transition-all" style={{ height: `${(d.lucro / maxChart) * 100}%`, minHeight: d.lucro > 0 ? 4 : 0 }} />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500">{d.mes}</span>
                </div>
              ))}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
              <div>
                <p className="text-gray-500 text-xs">Total Receitas</p>
                <p className="text-green-400 font-bold text-lg">{fmt(chartData.reduce((s, d) => s + d.receitas, 0))}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Despesas</p>
                <p className="text-red-400 font-bold text-lg">{fmt(chartData.reduce((s, d) => s + d.despesas, 0))}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Lucro Líquido</p>
                <p className="text-amber-400 font-bold text-lg">{fmt(chartData.reduce((s, d) => s + d.lucro, 0))}</p>
              </div>
            </div>
          </div>

          {/* Alerts + Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Alertas de Leads */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Alertas de Leads</h3>
                  <p className="text-gray-500 text-xs">{alertas.length} lead(s) sem resposta há +24h</p>
                </div>
              </div>
              {loading ? <p className="text-gray-600 text-sm text-center py-8">Carregando...</p> :
              alertas.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-green-400 text-sm font-medium">Tudo em dia!</p>
                  <p className="text-gray-600 text-xs">Nenhum lead sem resposta</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alertas.map(l => (
                    <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition cursor-pointer group">
                      <div className="w-9 h-9 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{l.nome}</p>
                        <p className="text-gray-500 text-xs">{l.procedimento} · {l.etapa}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-red-400 text-xs font-medium">Há {timeAgo(l.created_at)}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  ))}
                  <button className="w-full text-center text-amber-400 text-xs font-medium py-2 hover:text-amber-300 transition">
                    Ver Todos os Alertas →
                  </button>
                </div>
              )}
            </div>

            {/* Atividades Recentes */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Atividades Recentes</h3>
                  <p className="text-gray-500 text-xs">{atividades.length} atividade(s) recente(s)</p>
                </div>
              </div>
              {atividades.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">Nenhuma atividade ainda</p>
              ) : (
                <div className="space-y-1">
                  {atividades.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/50 transition">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${a.tipo === 'lead' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                        {a.tipo === 'lead' ? (
                          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm truncate">{a.desc}</p>
                      </div>
                      <span className="text-gray-600 text-xs shrink-0">Há {a.tempo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* HEAD IA Insight — SUPERIOR AO NEXUS */}
          <div className="mt-6 bg-gradient-to-r from-amber-500/5 to-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-lg">🧠</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-amber-400 font-semibold text-sm">HEAD IA — Insight Autônomo</h3>
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">IA</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {leads.length > 0
                    ? `Você tem ${alertas.length} leads sem resposta há mais de 24h. ${alertas.length > 3 ? 'Recomendo priorizar contato imediato — leads que esperam mais de 48h têm 60% menos chance de converter.' : 'Bom ritmo de atendimento. Continue assim.'} ${kpis.taxa < 30 ? 'Sua taxa de conversão está abaixo de 30% — considere revisar o script de abordagem.' : ''}`
                    : 'Nenhum lead cadastrado ainda. Comece adicionando leads pelo CRM ou importe via CSV.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, valor, variacao, positivo, cor, icon }: {
  label: string; valor: string; variacao: string; positivo: boolean; cor: string; icon: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
          <svg className={`w-5 h-5 ${cor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${positivo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {variacao}
        </span>
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${cor}`}>{valor}</p>
    </div>
  )
}
