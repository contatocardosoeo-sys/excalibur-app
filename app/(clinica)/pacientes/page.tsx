'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Paciente { id: string; nome: string; telefone: string | null; procedimento: string | null; status: string; created_at: string }

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('pacientes').select('*').order('nome').then(({ data }) => {
      if (data) setPacientes(data as Paciente[])
      setLoading(false)
    })
  }, [])

  const filtrados = useMemo(() =>
    pacientes.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())),
    [pacientes, busca]
  )

  const ativos = pacientes.filter(p => p.status === 'ativo').length

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Pacientes</h1>
            <p className="text-gray-400 text-sm mt-1">{ativos} ativos · {pacientes.length} total</p>
          </div>
        </div>

        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar paciente..."
          className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm mb-6 focus:outline-none focus:border-amber-500 placeholder-gray-500" />

        {loading ? <p className="text-gray-500 text-center py-20">Carregando...</p> : filtrados.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Nenhum paciente encontrado</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 hover:border-amber-600/40 rounded-xl p-5 transition">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{p.nome}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>{p.status}</span>
                </div>
                <p className="text-gray-500 text-xs">{p.procedimento || 'Sem procedimento'}</p>
                {p.telefone && <p className="text-gray-600 text-xs mt-1">{p.telefone}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
