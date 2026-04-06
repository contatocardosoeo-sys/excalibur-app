'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Lead { id: string; etapa: string; created_at: string }
interface Proposta { id: string; valor_total: number; status: string }

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('id,etapa,created_at'),
      supabase.from('propostas').select('id,valor_total,status'),
    ]).then(([l, p]) => {
      if (l.data) setLeads(l.data as Lead[])
      if (p.data) setPropostas(p.data as Proposta[])
      setLoading(false)
    })
  }, [])

  const kpis = useMemo(() => {
    const ag = leads.filter(l => ['Agendado', 'Compareceu', 'Fechou'].includes(l.etapa))
    const fech = leads.filter(l => l.etapa === 'Fechou')
    const receita = propostas.filter(p => p.status === 'pago').reduce((s, p) => s + Number(p.valor_total), 0)
    return { total: leads.length, agendados: ag.length, fechados: fech.length, receita }
  }, [leads, propostas])

  const ETAPAS = ['Recebido', 'Contato feito', 'Agendado', 'Compareceu', 'Fechou']

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Dashboard da Clínica</h2>
          <p className="text-gray-400 mt-1">Resumo geral em tempo real</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Kpi label="Total Leads" valor={String(kpis.total)} cor="text-amber-400" />
          <Kpi label="Agendados" valor={String(kpis.agendados)} cor="text-blue-400" />
          <Kpi label="Fechamentos" valor={String(kpis.fechados)} cor="text-green-400" />
          <Kpi label="Receita" valor={fmt(kpis.receita)} cor="text-green-400" />
        </div>

        {loading ? <p className="text-gray-500 text-center py-20">Carregando...</p> : (
          <>
            <h3 className="text-white font-semibold text-lg mb-4">Pipeline de Leads</h3>
            <div className="grid grid-cols-5 gap-4">
              {ETAPAS.map(etapa => {
                const count = leads.filter(l => l.etapa === etapa).length
                return (
                  <div key={etapa} className={`bg-gray-900 border rounded-xl p-4 ${etapa === 'Fechou' ? 'border-green-900' : 'border-gray-800'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${etapa === 'Fechou' ? 'text-green-400' : 'text-gray-400'}`}>{etapa}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${etapa === 'Fechou' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Kpi({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${cor}`}>{valor}</p>
    </div>
  )
}
