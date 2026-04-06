'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Lead { id: string; etapa: string; procedimento: string; created_at: string }
interface Proposta { id: string; valor_total: number; status: string }

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }

const ETAPAS = ['Recebido', 'Contato feito', 'Agendado', 'Compareceu', 'Fechou']

export default function BIPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('id,etapa,procedimento,created_at'),
      supabase.from('propostas').select('id,valor_total,status'),
    ]).then(([l, p]) => {
      if (l.data) setLeads(l.data as Lead[])
      if (p.data) setPropostas(p.data as Proposta[])
      setLoading(false)
    })
  }, [])

  const funil = useMemo(() => ETAPAS.map((etapa, i) => {
    const count = leads.filter(l => l.etapa === etapa).length
    const prev = i === 0 ? leads.length : leads.filter(l => ETAPAS.indexOf(l.etapa) >= i - 1).length
    return { etapa, count, taxa: prev > 0 ? (count / prev * 100) : 0 }
  }), [leads])

  const porProc = useMemo(() => {
    const map: Record<string, number> = {}
    leads.forEach(l => { map[l.procedimento] = (map[l.procedimento] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [leads])

  const receita = propostas.filter(p => p.status === 'pago').reduce((s, p) => s + Number(p.valor_total), 0)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-white text-2xl font-bold mb-1">BI & Análise</h1>
        <p className="text-gray-400 text-sm mb-6">Métricas da clínica em tempo real</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Kpi label="Total Leads" valor={String(leads.length)} cor="text-amber-400" />
          <Kpi label="Fechamentos" valor={String(leads.filter(l => l.etapa === 'Fechou').length)} cor="text-green-400" />
          <Kpi label="Receita" valor={fmt(receita)} cor="text-green-400" />
          <Kpi label="Conversão" valor={`${leads.length > 0 ? (leads.filter(l => l.etapa === 'Fechou').length / leads.length * 100).toFixed(0) : 0}%`} cor="text-amber-400" />
        </div>

        {loading ? <p className="text-gray-500 text-center py-20">Carregando...</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Funil de Conversão</h3>
              <div className="space-y-2">
                {funil.map(f => (
                  <div key={f.etapa}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{f.etapa}</span>
                      <span className="text-amber-400 font-semibold">{f.count} ({f.taxa.toFixed(0)}%)</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full" style={{ width: `${Math.min(f.taxa, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Leads por Procedimento</h3>
              <div className="space-y-2">
                {porProc.map(([proc, count]) => (
                  <div key={proc} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-gray-300 text-xs">{proc}</span>
                    <span className="text-amber-400 text-xs font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Kpi({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-lg font-bold mt-1 ${cor}`}>{valor}</p>
    </div>
  )
}
