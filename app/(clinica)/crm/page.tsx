'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

interface Lead { id: string; nome: string; telefone: string; procedimento: string; etapa: string; created_at: string }

const ETAPAS = ['Recebido', 'Contato feito', 'Agendado', 'Compareceu', 'Fechou']

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [modal, setModal] = useState(false)
  const [novo, setNovo] = useState({ nome: '', telefone: '', procedimento: 'Implante', etapa: 'Recebido' })

  async function carregar() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (data) setLeads(data as Lead[])
  }

  useEffect(() => { carregar() }, [])

  async function salvar() {
    if (!novo.nome.trim()) return
    await supabase.from('leads').insert([novo])
    setNovo({ nome: '', telefone: '', procedimento: 'Implante', etapa: 'Recebido' })
    setModal(false)
    carregar()
  }

  async function mudarEtapa(id: string, etapa: string) {
    await supabase.from('leads').update({ etapa }).eq('id', id)
    if (etapa === 'Fechou') {
      const lead = leads.find(l => l.id === id)
      if (lead) {
        await supabase.from('pacientes').upsert({ lead_id: lead.id, nome: lead.nome, telefone: lead.telefone, procedimento: lead.procedimento, status: 'ativo' }, { onConflict: 'lead_id' })
      }
    }
    carregar()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Leads / CRM</h1>
            <p className="text-gray-400 text-sm mt-1">{leads.length} leads no total</p>
          </div>
          <button onClick={() => setModal(true)} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-lg transition text-sm">+ Novo Lead</button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {ETAPAS.map(etapa => (
            <div key={etapa} className={`bg-gray-900 border rounded-xl p-4 ${etapa === 'Fechou' ? 'border-green-900' : 'border-gray-800'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold uppercase tracking-wider ${etapa === 'Fechou' ? 'text-green-400' : 'text-gray-400'}`}>{etapa}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-800 text-gray-400">{leads.filter(l => l.etapa === etapa).length}</span>
              </div>
              <div className="space-y-2">
                {leads.filter(l => l.etapa === etapa).map(lead => (
                  <div key={lead.id} className="bg-gray-800 rounded-lg p-3">
                    <p className="text-white text-sm font-medium">{lead.nome}</p>
                    <p className="text-gray-500 text-xs mt-1">{lead.procedimento} · {lead.telefone}</p>
                    <select value={lead.etapa} onChange={e => mudarEtapa(lead.id, e.target.value)}
                      className="mt-2 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300 text-xs">
                      {ETAPAS.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-white font-bold text-lg mb-4">Novo Lead</h2>
              <div className="space-y-3">
                <input value={novo.nome} onChange={e => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                <input value={novo.telefone} onChange={e => setNovo({ ...novo, telefone: e.target.value })} placeholder="Telefone" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                <select value={novo.procedimento} onChange={e => setNovo({ ...novo, procedimento: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                  {['Implante', 'Protocolo', 'Prótese', 'Estética', 'Outro'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={salvar} className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold py-2.5 rounded-lg text-sm">Salvar</button>
                <button onClick={() => setModal(false)} className="bg-gray-800 text-gray-300 px-5 py-2.5 rounded-lg text-sm">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
