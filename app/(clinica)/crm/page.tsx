'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

interface Lead {
  id: string; nome: string; telefone: string; email: string; cpf: string
  procedimento: string; etapa: string; cidade: string; estado: string; bairro: string
  whatsapp: string; score: number; origem: string; vendedor: string
  created_at: string
}

const ETAPAS = [
  { nome: 'Novo Lead', cor: 'border-blue-500/30 bg-blue-500/5', badge: 'bg-blue-500', prob: 5 },
  { nome: 'Qualificação', cor: 'border-purple-500/30 bg-purple-500/5', badge: 'bg-purple-500', prob: 40 },
  { nome: 'Contato Inicial', cor: 'border-amber-500/30 bg-amber-500/5', badge: 'bg-amber-500', prob: 15 },
  { nome: 'Em Negociação', cor: 'border-orange-500/30 bg-orange-500/5', badge: 'bg-orange-500', prob: 85 },
  { nome: 'Pagamento Pendente', cor: 'border-cyan-500/30 bg-cyan-500/5', badge: 'bg-cyan-500', prob: 90 },
  { nome: 'Fechado', cor: 'border-green-500/30 bg-green-500/5', badge: 'bg-green-500', prob: 100 },
]

const PROCEDIMENTOS = ['Implante', 'Protocolo', 'Prótese', 'Clareamento', 'Ortodontia', 'Estética', 'Limpeza', 'Outro']
const ESTADOS_BR = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }
function timeAgo(dt: string) { const h = Math.floor((Date.now() - new Date(dt).getTime()) / 3600000); if (h < 1) return 'agora'; if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d` }

function scoreColor(s: number) {
  if (s >= 70) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'QUENTE', icon: '🔥' }
  if (s >= 30) return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'MORNO', icon: '' }
  return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'FRIO', icon: '❄️' }
}

const EMPTY_LEAD = { nome: '', telefone: '', email: '', cpf: '', whatsapp: '', procedimento: 'Implante', etapa: 'Novo Lead', cidade: '', estado: 'SP', bairro: '', score: 0, origem: 'Outros', vendedor: '' }

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [modalLead, setModalLead] = useState<Lead | null>(null)
  const [novoModal, setNovoModal] = useState(false)
  const [form, setForm] = useState(EMPTY_LEAD)
  const [modalTab, setModalTab] = useState<'detalhes' | 'atividades' | 'historico'>('detalhes')
  const [busca, setBusca] = useState('')
  const [view, setView] = useState<'kanban' | 'lista'>('kanban')
  const [dragLeadId, setDragLeadId] = useState<string | null>(null)
  const [dragOverEtapa, setDragOverEtapa] = useState<string | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    setDragLeadId(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', leadId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, etapaNome: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverEtapa(etapaNome)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverEtapa(null)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, newEtapa: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    setDragLeadId(null)
    setDragOverEtapa(null)
    if (!leadId) return
    const lead = leads.find(l => l.id === leadId)
    if (!lead || lead.etapa === newEtapa) return
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, etapa: newEtapa } : l))
    await supabase.from('leads').update({ etapa: newEtapa }).eq('id', leadId)
    carregar()
  }, [leads])

  const handleDragEnd = useCallback(() => {
    setDragLeadId(null)
    setDragOverEtapa(null)
  }, [])

  async function carregar() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (data) setLeads(data as Lead[])
    setLoading(false)
  }

  useEffect(() => {
    carregar()
    const ch = supabase.channel('crm-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => carregar())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const kpis = useMemo(() => {
    const total = leads.length
    const valorPotencial = leads.reduce((s, l) => s + (l.score > 50 ? 5000 : 2000), 0)
    const fechados = leads.filter(l => l.etapa === 'Fechado').length
    const taxa = total > 0 ? Math.round((fechados / total) * 100 * 10) / 10 : 0
    const tempoMedio = total > 0 ? Math.round(leads.reduce((s, l) => s + (Date.now() - new Date(l.created_at).getTime()) / 86400000, 0) / total * 10) / 10 : 0
    const hot = leads.filter(l => (l.score || 0) >= 70).length
    const semAtividade = leads.filter(l => (Date.now() - new Date(l.created_at).getTime()) > 48 * 3600000 && !['Fechado'].includes(l.etapa)).length
    return { total, valorPotencial, taxa, tempoMedio, hot, semAtividade }
  }, [leads])

  const filteredLeads = useMemo(() => {
    if (!busca) return leads
    const q = busca.toLowerCase()
    return leads.filter(l => l.nome?.toLowerCase().includes(q) || l.telefone?.includes(q) || l.email?.toLowerCase().includes(q))
  }, [leads, busca])

  async function salvarNovoLead() {
    if (!form.nome.trim() || !form.whatsapp.trim()) return
    await supabase.from('leads').insert([{ ...form }])
    setForm(EMPTY_LEAD)
    setNovoModal(false)
    carregar()
  }

  async function atualizarLead() {
    if (!modalLead) return
    await supabase.from('leads').update({
      nome: form.nome, telefone: form.telefone, email: form.email, cpf: form.cpf,
      whatsapp: form.whatsapp, procedimento: form.procedimento, etapa: form.etapa,
      cidade: form.cidade, estado: form.estado, bairro: form.bairro, score: form.score,
      origem: form.origem, vendedor: form.vendedor
    }).eq('id', modalLead.id)
    setModalLead(null)
    carregar()
  }

  async function mudarEtapa(id: string, novaEtapa: string) {
    await supabase.from('leads').update({ etapa: novaEtapa }).eq('id', id)
    carregar()
  }

  function abrirLead(lead: Lead) {
    setModalLead(lead)
    setForm({ nome: lead.nome || '', telefone: lead.telefone || '', email: lead.email || '', cpf: lead.cpf || '', whatsapp: lead.whatsapp || lead.telefone || '', procedimento: lead.procedimento || 'Implante', etapa: lead.etapa || 'Novo Lead', cidade: lead.cidade || '', estado: lead.estado || 'SP', bairro: lead.bairro || '', score: lead.score || 0, origem: lead.origem || 'Outros', vendedor: lead.vendedor || '' })
    setModalTab('detalhes')
  }

  return (
    <>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><span className="text-amber-500 font-bold">⚔️</span><span className="text-gray-600">/</span><span className="text-white font-semibold">Leads / CRM</span></div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={busca} onChange={e => setBusca(e.target.value)} type="text" placeholder="Buscar por nome, email ou telefone..." className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 w-72 focus:outline-none focus:border-amber-500/50" />
              <kbd className="absolute right-2 top-1.5 text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-white text-2xl font-bold">Pipeline de Vendas</h1>
              <p className="text-gray-500 text-sm mt-1">{leads.length} leads ativos no funil</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-0.5">
                <button onClick={() => setView('kanban')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${view === 'kanban' ? 'bg-amber-500 text-gray-950' : 'text-gray-400'}`}>Kanban</button>
                <button onClick={() => setView('lista')} className={`px-3 py-1 rounded-md text-xs font-medium transition ${view === 'lista' ? 'bg-amber-500 text-gray-950' : 'text-gray-400'}`}>Lista</button>
              </div>
              <button onClick={() => { setNovoModal(true); setForm(EMPTY_LEAD) }} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2 rounded-lg transition text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Novo Lead
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            <MiniKpi label="Total Pipeline" valor={String(kpis.total)} cor="text-white" />
            <MiniKpi label="Valor Potencial" valor={fmt(kpis.valorPotencial)} cor="text-amber-400" />
            <MiniKpi label="Taxa Conversão" valor={`${kpis.taxa}%`} cor="text-green-400" />
            <MiniKpi label="Tempo Médio" valor={`${kpis.tempoMedio}d`} cor="text-blue-400" />
            <MiniKpi label="Leads Hot" valor={String(kpis.hot)} cor="text-red-400" />
            <MiniKpi label="Sem Atividade" valor={String(kpis.semAtividade)} cor="text-gray-400" />
          </div>

          {/* KANBAN */}
          {view === 'kanban' && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {ETAPAS.map(etapa => {
                const etapaLeads = filteredLeads.filter(l => (l.etapa || 'Novo Lead') === etapa.nome || (l.etapa === 'Recebido' && etapa.nome === 'Novo Lead') || (l.etapa === 'Contato feito' && etapa.nome === 'Contato Inicial') || (l.etapa === 'Compareceu' && etapa.nome === 'Pagamento Pendente') || (l.etapa === 'Fechou' && etapa.nome === 'Fechado'))
                return (
                  <div key={etapa.nome}
                    onDragOver={e => handleDragOver(e, etapa.nome)}
                    onDragLeave={handleDragLeave}
                    onDrop={e => handleDrop(e, etapa.nome)}
                    className={`min-w-[220px] flex-1 border rounded-xl p-3 transition-all duration-200 ${etapa.cor} ${dragOverEtapa === etapa.nome ? 'border-amber-500 ring-1 ring-amber-500/50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${etapa.badge}`} />
                        <p className="text-xs font-bold uppercase tracking-wider text-white">{etapa.nome}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400 font-bold">{etapaLeads.length}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-3">Total: {fmt(etapaLeads.length * 3000)} · {etapa.prob}% prob.</p>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {etapaLeads.map(lead => {
                        const sc = scoreColor(lead.score || 0)
                        return (
                          <div key={lead.id} draggable="true"
                            onDragStart={e => handleDragStart(e, lead.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => abrirLead(lead)}
                            className={`bg-gray-900/80 border border-gray-800 rounded-xl p-3 cursor-grab hover:border-amber-500/30 transition group ${dragLeadId === lead.id ? 'opacity-50' : ''}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">{(lead.nome || '?')[0].toUpperCase()}</div>
                                <div>
                                  <p className="text-white text-sm font-medium leading-tight">{lead.nome}</p>
                                  {lead.cidade && <p className="text-gray-500 text-[10px]">@ {lead.cidade}</p>}
                                </div>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${sc.bg} ${sc.text}`}>{sc.icon}{sc.icon ? ' ' : ''}{sc.label} {lead.score || 0}/100</span>
                            </div>
                            {lead.procedimento && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">{lead.procedimento}</span>
                            )}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                              <div className="flex gap-1.5">
                                <button className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-500 hover:text-green-400 transition" title="WhatsApp">
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                                </button>
                                <button className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 transition" title="Email">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </button>
                              </div>
                              <span className="text-[10px] text-gray-600">{timeAgo(lead.created_at)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* LISTA */}
          {view === 'lista' && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Lead</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Procedimento</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Etapa</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Score</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => {
                    const sc = scoreColor(lead.score || 0)
                    return (
                      <tr key={lead.id} onClick={() => abrirLead(lead)} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">{(lead.nome || '?')[0].toUpperCase()}</div>
                            <div>
                              <p className="text-white text-sm font-medium">{lead.nome}</p>
                              <p className="text-gray-500 text-xs">{lead.telefone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{lead.procedimento}</span></td>
                        <td className="px-4 py-3"><span className="text-xs text-gray-300">{lead.etapa}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sc.bg} ${sc.text}`}>{sc.icon}{sc.icon ? ' ' : ''}{lead.score || 0} · {sc.label}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(lead.created_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITAR LEAD — Slide-in lateral */}
      {modalLead && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && setModalLead(null)}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalLead(null)} />
          <div className="relative w-full max-w-lg bg-gray-900 border-l border-gray-800 h-full overflow-y-auto animate-slide-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-lg">Editar Lead</h2>
                <p className="text-gray-600 text-[10px] font-mono">ID: {modalLead.id.slice(0, 8)}...</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition">WhatsApp</button>
                <button onClick={() => setModalLead(null)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {(['detalhes', 'atividades', 'historico'] as const).map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)}
                  className={`flex-1 py-3 text-xs font-medium transition ${modalTab === tab ? 'text-amber-400 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-300'}`}>
                  {tab === 'detalhes' ? '📋 Detalhes' : tab === 'atividades' ? '📌 Atividades' : '📜 Histórico'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {modalTab === 'detalhes' && (
                <div className="space-y-5">
                  <div>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">Informações Básicas</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nome do Lead *" value={form.nome} onChange={v => setForm({ ...form, nome: v })} />
                      <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                      <Field label="Celular" value={form.telefone} onChange={v => setForm({ ...form, telefone: v })} placeholder="(00) 00000-0000" />
                      <Field label="WhatsApp *" value={form.whatsapp} onChange={v => setForm({ ...form, whatsapp: v })} placeholder="(00) 00000-0000" />
                      <Field label="CPF" value={form.cpf} onChange={v => setForm({ ...form, cpf: v })} placeholder="000.000.000-00" />
                      <Field label="Bairro" value={form.bairro} onChange={v => setForm({ ...form, bairro: v })} />
                      <div>
                        <label className="text-gray-500 text-xs mb-1 block">Estado</label>
                        <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                          {ESTADOS_BR.map(e => <option key={e}>{e}</option>)}
                        </select>
                      </div>
                      <Field label="Cidade" value={form.cidade} onChange={v => setForm({ ...form, cidade: v })} />
                    </div>
                  </div>

                  <div>
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">Informações do Lead</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 text-xs mb-1 block">Estágio *</label>
                        <select value={form.etapa} onChange={e => setForm({ ...form, etapa: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                          {ETAPAS.map(e => <option key={e.nome}>{e.nome}</option>)}
                          <option>Recebido</option><option>Contato feito</option><option>Agendado</option><option>Compareceu</option><option>Fechou</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs mb-1 block">Lead Score</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min={0} max={100} value={form.score} onChange={e => setForm({ ...form, score: Number(e.target.value) })} className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50" />
                          {(() => { const sc = scoreColor(form.score); return <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sc.bg} ${sc.text}`}>{sc.label}</span> })()}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="text-gray-500 text-xs mb-1 block">Procedimento(s) de Interesse</label>
                        <select value={form.procedimento} onChange={e => setForm({ ...form, procedimento: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                          {PROCEDIMENTOS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-gray-800">
                    <button onClick={() => setModalLead(null)} className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition">Cancelar</button>
                    <button className="px-4 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-500/20 transition">⚡ Converter em Paciente</button>
                    <button onClick={atualizarLead} className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold py-2.5 rounded-lg text-sm transition">Atualizar Lead</button>
                  </div>
                </div>
              )}

              {modalTab === 'atividades' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Atividades & Follow-ups (0)</p>
                    <button className="px-3 py-1.5 bg-amber-500 text-gray-950 rounded-lg text-xs font-semibold">+ Nova Atividade</button>
                  </div>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Nenhuma atividade registrada</p>
                    <p className="text-gray-600 text-xs mt-1">Registre ligações, envios de orçamento ou notas internas</p>
                  </div>
                </div>
              )}

              {modalTab === 'historico' && (
                <div>
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-4">Histórico</p>
                  <div className="relative pl-6 border-l border-gray-800">
                    <div className="mb-4">
                      <div className="absolute left-[-5px] w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">SISTEMA</span>
                          <span className="text-white text-sm font-medium">Lead criado</span>
                        </div>
                        <p className="text-gray-500 text-xs">Lead &quot;{modalLead.nome}&quot; foi criado</p>
                        <p className="text-gray-600 text-[10px] mt-1">{new Date(modalLead.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs text-center">— FIM DE HISTÓRICO —</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO LEAD */}
      {novoModal && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && setNovoModal(false)}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setNovoModal(false)} />
          <div className="relative w-full max-w-lg bg-gray-900 border-l border-gray-800 h-full overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-lg">Novo Lead</h2>
                <p className="text-gray-500 text-xs">Preencha os campos abaixo</p>
              </div>
              <button onClick={() => setNovoModal(false)} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
            </div>
            <div className="p-4 space-y-5">
              <div>
                <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">Informações Básicas</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nome do Lead *" value={form.nome} onChange={v => setForm({ ...form, nome: v })} />
                  <Field label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                  <Field label="Celular" value={form.telefone} onChange={v => setForm({ ...form, telefone: v })} placeholder="(00) 00000-0000" />
                  <Field label="WhatsApp *" value={form.whatsapp} onChange={v => setForm({ ...form, whatsapp: v })} placeholder="(00) 00000-0000" />
                  <Field label="CPF" value={form.cpf} onChange={v => setForm({ ...form, cpf: v })} placeholder="000.000.000-00" />
                  <Field label="Bairro" value={form.bairro} onChange={v => setForm({ ...form, bairro: v })} />
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">Estado</label>
                    <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                      {ESTADOS_BR.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <Field label="Cidade" value={form.cidade} onChange={v => setForm({ ...form, cidade: v })} />
                </div>
              </div>
              <div>
                <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-3">Informações do Lead</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">Estágio</label>
                    <select value={form.etapa} onChange={e => setForm({ ...form, etapa: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                      {ETAPAS.map(e => <option key={e.nome}>{e.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1 block">Lead Score</label>
                    <input type="number" min={0} max={100} value={form.score} onChange={e => setForm({ ...form, score: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-xs mb-1 block">Procedimento</label>
                    <select value={form.procedimento} onChange={e => setForm({ ...form, procedimento: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50">
                      {PROCEDIMENTOS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-800">
                <button onClick={() => setNovoModal(false)} className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm">Cancelar</button>
                <button onClick={salvarNovoLead} className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold py-2.5 rounded-lg text-sm transition">Criar Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-gray-500 text-xs mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50 placeholder-gray-600" />
    </div>
  )
}

function MiniKpi({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
      <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${cor}`}>{valor}</p>
    </div>
  )
}
