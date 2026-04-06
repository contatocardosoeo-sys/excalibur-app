'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Proposta { id: string; paciente_nome: string; procedimento: string | null; valor_total: number; entrada: number; parcelas: number; valor_parcela: number; status: string; created_at: string }

function fmt(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) }

const STATUS_COR: Record<string, string> = {
  pendente: 'bg-blue-900/40 text-blue-300',
  aprovado: 'bg-amber-500/20 text-amber-400',
  pago: 'bg-green-900/40 text-green-400',
  negado: 'bg-red-900/40 text-red-400',
  cancelado: 'bg-gray-800 text-gray-500',
}

export default function FinanceiroPage() {
  const [props, setProps] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('propostas').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProps(data as Proposta[]); setLoading(false) })
  }, [])

  const kpis = useMemo(() => {
    const pagas = props.filter(p => p.status === 'pago')
    const pipeline = props.filter(p => p.status === 'pendente')
    return {
      receita: pagas.reduce((s, p) => s + Number(p.valor_total), 0),
      pipeline: pipeline.reduce((s, p) => s + Number(p.valor_total), 0),
      total: props.length,
      taxa: props.length > 0 ? (pagas.length / props.length * 100) : 0,
    }
  }, [props])

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-white text-2xl font-bold mb-1">Excalibur Pay</h1>
        <p className="text-gray-400 text-sm mb-6">Propostas e receita da clínica</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Kpi label="Receita" valor={fmt(kpis.receita)} cor="text-green-400" />
          <Kpi label="Pipeline" valor={fmt(kpis.pipeline)} cor="text-blue-400" />
          <Kpi label="Propostas" valor={String(kpis.total)} cor="text-amber-400" />
          <Kpi label="Taxa Aprovação" valor={`${kpis.taxa.toFixed(0)}%`} cor="text-amber-400" />
        </div>

        {loading ? <p className="text-gray-500 text-center py-20">Carregando...</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {props.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex justify-between mb-2">
                  <p className="text-white font-semibold">{p.paciente_nome}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COR[p.status] || 'bg-gray-800 text-gray-500'}`}>{p.status}</span>
                </div>
                <p className="text-amber-400 text-xs">{p.procedimento}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div><p className="text-gray-500">Total</p><p className="text-white font-semibold">{fmt(Number(p.valor_total))}</p></div>
                  <div><p className="text-gray-500">Entrada</p><p className="text-white font-semibold">{fmt(Number(p.entrada))}</p></div>
                  <div><p className="text-gray-500">Parcelas</p><p className="text-white font-semibold">{p.parcelas}x {fmt(Number(p.valor_parcela))}</p></div>
                </div>
              </div>
            ))}
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
