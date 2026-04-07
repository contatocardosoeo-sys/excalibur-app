'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type StatusAg = 'agendado' | 'confirmado' | 'compareceu' | 'cancelado' | 'noshow'
interface Agendamento { id: string; paciente_nome: string; telefone: string | null; data: string; hora: string; procedimento: string | null; status: StatusAg; created_at: string }

const STATUS: Record<StatusAg, { label: string; cor: string }> = {
  agendado: { label: 'Agendado', cor: 'bg-blue-900/40 text-blue-300 border-blue-700/50' },
  confirmado: { label: 'Confirmado', cor: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
  compareceu: { label: 'Compareceu', cor: 'bg-green-900/40 text-green-400 border-green-700/50' },
  cancelado: { label: 'Cancelado', cor: 'bg-gray-800 text-gray-500 border-gray-700' },
  noshow: { label: 'No-show', cor: 'bg-red-900/40 text-red-400 border-red-700/50' },
}

const HORAS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

function getDiaSemana(offset: number): string {
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export default function AgendaPage() {
  const [ags, setAgs] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [semanaOffset, setSemanaOffset] = useState(0)

  useEffect(() => {
    supabase.from('agendamentos').select('*').order('data').order('hora')
      .then(({ data }) => { if (data) setAgs(data as Agendamento[]); setLoading(false) })
  }, [])

  const diasSemana = useMemo(() => {
    const base = semanaOffset * 7
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + base - d.getDay() + i)
      return { data: d.toISOString().slice(0, 10), label: d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }) }
    })
  }, [semanaOffset])

  async function mudarStatus(a: Agendamento, s: StatusAg) {
    await supabase.from('agendamentos').update({ status: s }).eq('id', a.id)
    const { data } = await supabase.from('agendamentos').select('*').order('data').order('hora')
    if (data) setAgs(data as Agendamento[])
  }

  return (
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-white text-2xl font-bold">Agenda — Visão Semanal</h1>
            <p className="text-gray-400 text-sm mt-1">Calendar view da clínica</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSemanaOffset(s => s - 1)} className="bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-sm hover:text-white">← Anterior</button>
            <button onClick={() => setSemanaOffset(0)} className="bg-amber-500 text-gray-950 font-semibold px-4 py-1.5 rounded-lg text-sm">Hoje</button>
            <button onClick={() => setSemanaOffset(s => s + 1)} className="bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-sm hover:text-white">Próxima →</button>
          </div>
        </div>

        {loading ? <p className="text-gray-500 text-center py-20">Carregando...</p> : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 min-w-[900px]">
              {/* Header */}
              {diasSemana.map(d => {
                const isHoje = d.data === new Date().toISOString().slice(0, 10)
                return (
                  <div key={d.data} className={`text-center py-2 text-xs font-semibold rounded-t-lg ${isHoje ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-900 text-gray-400'}`}>
                    {d.label}
                  </div>
                )
              })}

              {/* Slots */}
              {diasSemana.map(dia => {
                const agsDia = ags.filter(a => a.data === dia.data)
                const isHoje = dia.data === new Date().toISOString().slice(0, 10)
                return (
                  <div key={dia.data} className={`bg-gray-900 border rounded-b-lg p-2 min-h-[300px] ${isHoje ? 'border-amber-500/30' : 'border-gray-800'}`}>
                    {agsDia.length === 0 ? (
                      <p className="text-gray-700 text-[10px] text-center mt-4">Sem agendamentos</p>
                    ) : (
                      <div className="space-y-1">
                        {agsDia.map(a => (
                          <div key={a.id} className={`border rounded-lg p-2 text-[10px] cursor-pointer transition hover:scale-[1.02] ${STATUS[a.status].cor}`}>
                            <p className="font-bold">{a.hora.slice(0, 5)}</p>
                            <p className="font-medium truncate">{a.paciente_nome}</p>
                            {a.procedimento && <p className="opacity-70 truncate">{a.procedimento}</p>}
                            <div className="flex gap-1 mt-1">
                              {a.status === 'agendado' && <button onClick={() => mudarStatus(a, 'confirmado')} className="bg-amber-500/30 rounded px-1 py-0.5 text-[8px]">Confirmar</button>}
                              {(a.status === 'agendado' || a.status === 'confirmado') && <button onClick={() => mudarStatus(a, 'compareceu')} className="bg-green-500/30 rounded px-1 py-0.5 text-[8px]">Veio</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
  )
}
