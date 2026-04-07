'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Search, Plus, Users, UserCheck, Activity, UserPlus,
  Phone, Mail, Calendar, MapPin, Upload, FileText,
  Image, Clock, CalendarDays, StickyNote, ChevronRight,
  MoreHorizontal, Eye, Trash2, Edit3, X, Save,
  AlertCircle, Heart, Pill, Shield, CheckCircle2
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  telefone: string | null
  email: string | null
  data_nascimento: string | null
  procedimento: string | null
  status: string
  created_at: string
}

type ToothStatus = 'saudavel' | 'carie' | 'restauracao' | 'ausente' | 'implante'

interface ToothData {
  number: number
  status: ToothStatus
}

interface AnamneseData {
  alergias: string
  medicamentos: string
  doencas_cronicas: string[]
  cirurgias_previas: string
  fumante: boolean
  etilista: boolean
  gravidez: boolean
  observacoes: string
}

interface PlanoItem {
  id: string
  procedimento: string
  dente: string
  status: 'pendente' | 'em_andamento' | 'concluido'
  valor: number
  data: string
}

interface HistoricoItem {
  id: string
  tipo: string
  descricao: string
  data: string
}

interface AgendamentoItem {
  id: string
  data: string
  hora: string
  procedimento: string
  status: 'agendado' | 'confirmado' | 'compareceu' | 'faltou' | 'cancelado'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '')
  if (clean.length !== 11) return cpf
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  if (clean.length === 10) return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  return phone
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'ativo': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'em_tratamento': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'inativo': return 'bg-gray-700/40 text-gray-500 border-gray-600/30'
    case 'concluido': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    default: return 'bg-gray-700/40 text-gray-400 border-gray-600/30'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ativo': return 'Ativo'
    case 'em_tratamento': return 'Em Tratamento'
    case 'inativo': return 'Inativo'
    case 'concluido': return 'Concluído'
    default: return status
  }
}

// ─── Tooth constants ──────────────────────────────────────────────────────────

const UPPER_TEETH = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28]
const LOWER_TEETH = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38]

const TOOTH_STATUS_OPTIONS: { value: ToothStatus; label: string; color: string }[] = [
  { value: 'saudavel', label: 'Saudável', color: '#22c55e' },
  { value: 'carie', label: 'Cárie', color: '#ef4444' },
  { value: 'restauracao', label: 'Restauração', color: '#3b82f6' },
  { value: 'ausente', label: 'Ausente', color: '#6b7280' },
  { value: 'implante', label: 'Implante', color: '#f59e0b' },
]

function getToothColor(status: ToothStatus): string {
  return TOOTH_STATUS_OPTIONS.find(s => s.value === status)?.color || '#22c55e'
}

// ─── Mock data generators ─────────────────────────────────────────────────────

function generateMockPlano(): PlanoItem[] {
  return [
    { id: '1', procedimento: 'Limpeza Profilática', dente: '—', status: 'concluido', valor: 180, data: '2026-03-15' },
    { id: '2', procedimento: 'Restauração Classe II', dente: '36', status: 'em_andamento', valor: 350, data: '2026-04-01' },
    { id: '3', procedimento: 'Implante Unitário', dente: '46', status: 'pendente', valor: 4500, data: '2026-05-10' },
  ]
}

function generateMockHistorico(): HistoricoItem[] {
  return [
    { id: '1', tipo: 'consulta', descricao: 'Consulta de avaliação inicial', data: '2026-03-10T10:00:00' },
    { id: '2', tipo: 'procedimento', descricao: 'Limpeza profilática realizada', data: '2026-03-15T14:30:00' },
    { id: '3', tipo: 'financeiro', descricao: 'Pagamento de R$ 180,00 registrado', data: '2026-03-15T15:00:00' },
    { id: '4', tipo: 'agendamento', descricao: 'Agendamento criado para 01/04/2026', data: '2026-03-20T09:00:00' },
    { id: '5', tipo: 'consulta', descricao: 'Restauração dente 36 — sessão 1', data: '2026-04-01T11:00:00' },
  ]
}

function generateMockAgendamentos(): AgendamentoItem[] {
  return [
    { id: '1', data: '2026-03-10', hora: '10:00', procedimento: 'Avaliação', status: 'compareceu' },
    { id: '2', data: '2026-03-15', hora: '14:30', procedimento: 'Limpeza', status: 'compareceu' },
    { id: '3', data: '2026-04-01', hora: '11:00', procedimento: 'Restauração', status: 'confirmado' },
    { id: '4', data: '2026-05-10', hora: '09:00', procedimento: 'Implante', status: 'agendado' },
  ]
}

// ─── Odontograma Component ───────────────────────────────────────────────────

function Odontograma() {
  const [teeth, setTeeth] = useState<Map<number, ToothStatus>>(() => {
    const m = new Map<number, ToothStatus>()
    ;[...UPPER_TEETH, ...LOWER_TEETH].forEach(t => m.set(t, 'saudavel'))
    // Some demo markings
    m.set(36, 'restauracao')
    m.set(46, 'ausente')
    m.set(17, 'carie')
    m.set(25, 'implante')
    return m
  })
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

  const cycleTooth = useCallback((num: number) => {
    setSelectedTooth(num)
  }, [])

  const setToothStatus = useCallback((num: number, status: ToothStatus) => {
    setTeeth(prev => {
      const next = new Map(prev)
      next.set(num, status)
      return next
    })
    setSelectedTooth(null)
  }, [])

  // Position teeth in an arch shape
  function getToothPosition(index: number, total: number, isUpper: boolean): { x: number; y: number } {
    const centerX = 50
    const radiusX = 42
    const radiusY = isUpper ? 22 : 22
    const centerY = isUpper ? 38 : 62

    // Spread teeth across an arc
    const startAngle = Math.PI
    const endAngle = 0
    const angle = startAngle + (endAngle - startAngle) * (index / (total - 1))

    const x = centerX + radiusX * Math.cos(angle)
    const yOffset = radiusY * Math.sin(angle)
    const y = isUpper ? centerY - yOffset : centerY + yOffset

    return { x, y }
  }

  function renderToothRow(teethNums: number[], isUpper: boolean) {
    return teethNums.map((num, i) => {
      const pos = getToothPosition(i, teethNums.length, isUpper)
      const status = teeth.get(num) || 'saudavel'
      const color = getToothColor(status)
      const isSelected = selectedTooth === num
      const isMolar = (num % 10 >= 6) || (num % 10 <= 3 && num % 10 >= 1 && [4,3].includes(Math.floor(num/10) % 10) ? false : num % 10 >= 6)
      const size = [1,2,3].includes(num % 10) ? 13 : 15

      return (
        <g key={num} style={{ cursor: 'pointer' }} onClick={() => cycleTooth(num)}>
          <rect
            x={pos.x - size/2}
            y={pos.y - size/2}
            width={size}
            height={size}
            rx={num % 10 <= 3 && num % 10 >= 1 ? 6 : 3}
            fill={color}
            stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={isSelected ? 1.5 : 0.5}
            opacity={status === 'ausente' ? 0.4 : 1}
          />
          <text
            x={pos.x}
            y={isUpper ? pos.y - size/2 - 3 : pos.y + size/2 + 9}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="6"
            fontFamily="monospace"
          >
            {num}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Odontograma Interativo</h3>
        <div className="flex gap-3">
          {TOOTH_STATUS_OPTIONS.map(opt => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: opt.color, opacity: opt.value === 'ausente' ? 0.4 : 1 }} />
              <span className="text-[10px] text-gray-500">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 relative">
        <svg viewBox="0 0 100 100" className="w-full max-w-lg mx-auto" style={{ height: 'auto' }}>
          {/* Center line */}
          <line x1="50" y1="25" x2="50" y2="75" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="2,2" />
          {/* Upper arch guide */}
          <path d="M 8 38 Q 50 10 92 38" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
          {/* Lower arch guide */}
          <path d="M 8 62 Q 50 90 92 62" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
          {/* Labels */}
          <text x="50" y="8" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontWeight="500">SUPERIOR</text>
          <text x="50" y="98" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5" fontWeight="500">INFERIOR</text>
          <text x="3" y="50" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="4">D</text>
          <text x="97" y="50" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="4">E</text>

          {renderToothRow(UPPER_TEETH, true)}
          {renderToothRow(LOWER_TEETH, false)}
        </svg>

        {/* Tooth status selector popup */}
        {selectedTooth !== null && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs font-semibold">Dente {selectedTooth}</span>
              <button onClick={() => setSelectedTooth(null)} className="text-gray-500 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-1.5">
              {TOOTH_STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setToothStatus(selectedTooth, opt.value)}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition hover:bg-gray-800 ${teeth.get(selectedTooth) === opt.value ? 'bg-gray-800 ring-1 ring-amber-500/50' : ''}`}
                >
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: opt.color, opacity: opt.value === 'ausente' ? 0.4 : 1 }} />
                  <span className="text-[9px] text-gray-400">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-xs text-center">Clique em um dente para alterar o status</p>
    </div>
  )
}

// ─── Patient Detail Sheet ─────────────────────────────────────────────────────

function PatientSheet({ paciente, open, onClose }: { paciente: Paciente | null; open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [observacoes, setObservacoes] = useState('Paciente colaborativo, sem intercorrências nas consultas anteriores.')
  const [anamnese, setAnamnese] = useState<AnamneseData>({
    alergias: '',
    medicamentos: '',
    doencas_cronicas: [],
    cirurgias_previas: '',
    fumante: false,
    etilista: false,
    gravidez: false,
    observacoes: '',
  })

  const plano = useMemo(generateMockPlano, [])
  const historico = useMemo(generateMockHistorico, [])
  const agendamentos = useMemo(generateMockAgendamentos, [])

  if (!paciente) return null

  const doencasOptions = ['Diabetes', 'Hipertensão', 'Cardiopatia', 'Asma', 'HIV/AIDS', 'Hepatite', 'Epilepsia', 'Hemofilia', 'Anemia', 'Osteoporose']

  const tabs = [
    { label: 'Dados', icon: <Users className="w-3.5 h-3.5" /> },
    { label: 'Anamnese', icon: <Heart className="w-3.5 h-3.5" /> },
    { label: 'Odontograma', icon: <Shield className="w-3.5 h-3.5" /> },
    { label: 'Plano', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Financeiro', icon: <Activity className="w-3.5 h-3.5" /> },
    { label: 'Documentos', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Radiografias', icon: <Image className="w-3.5 h-3.5" /> },
    { label: 'Histórico', icon: <Clock className="w-3.5 h-3.5" /> },
    { label: 'Agenda', icon: <CalendarDays className="w-3.5 h-3.5" /> },
    { label: 'Notas', icon: <StickyNote className="w-3.5 h-3.5" /> },
  ]

  const agendamentoStatusColor: Record<string, string> = {
    agendado: 'bg-blue-500/20 text-blue-400',
    confirmado: 'bg-amber-500/20 text-amber-400',
    compareceu: 'bg-green-500/20 text-green-400',
    faltou: 'bg-red-500/20 text-red-400',
    cancelado: 'bg-gray-700/40 text-gray-500',
  }

  const planoStatusColor: Record<string, string> = {
    pendente: 'bg-gray-700/40 text-gray-400',
    em_andamento: 'bg-amber-500/20 text-amber-400',
    concluido: 'bg-green-500/20 text-green-400',
  }

  const historicoIcon: Record<string, string> = {
    consulta: '🦷',
    procedimento: '⚕️',
    financeiro: '💰',
    agendamento: '📅',
  }

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="!w-[680px] !max-w-[680px] bg-gray-950 border-gray-800 p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <SheetHeader className="p-5 pb-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold">
              {paciente.nome.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="!text-white !text-lg !font-bold truncate">{paciente.nome}</SheetTitle>
              <SheetDescription className="!text-gray-500 !text-xs mt-0.5">
                {paciente.cpf ? formatCPF(paciente.cpf) : 'CPF não cadastrado'} · Desde {formatDate(paciente.created_at)}
              </SheetDescription>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${getStatusColor(paciente.status)}`}>
              {getStatusLabel(paciente.status)}
            </span>
          </div>
        </SheetHeader>

        {/* Tab navigation */}
        <div className="shrink-0 border-b border-gray-800 overflow-x-auto">
          <div className="flex px-2 py-1 gap-0.5 min-w-max">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === i
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Tab 0: Dados Pessoais */}
          {activeTab === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">Nome completo</label>
                  <Input defaultValue={paciente.nome} className="bg-gray-900 border-gray-800 text-white text-sm" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">CPF</label>
                  <Input defaultValue={paciente.cpf || ''} placeholder="000.000.000-00" className="bg-gray-900 border-gray-800 text-white text-sm" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <Input defaultValue={paciente.telefone || ''} placeholder="(00) 00000-0000" className="bg-gray-900 border-gray-800 text-white text-sm pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <Input defaultValue={paciente.email || ''} placeholder="email@exemplo.com" className="bg-gray-900 border-gray-800 text-white text-sm pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">Data de nascimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <Input type="date" defaultValue={paciente.data_nascimento || ''} className="bg-gray-900 border-gray-800 text-white text-sm pl-9" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-xs block mb-1.5">Procedimento principal</label>
                  <Input defaultValue={paciente.procedimento || ''} className="bg-gray-900 border-gray-800 text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1.5">Endereço completo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-600" />
                  <Input placeholder="Rua, número, bairro, cidade — UF" className="bg-gray-900 border-gray-800 text-white text-sm pl-9" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Salvar alterações
                </Button>
              </div>
            </div>
          )}

          {/* Tab 1: Anamnese */}
          {activeTab === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-gray-500 text-xs block mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Alergias
                </label>
                <Textarea
                  value={anamnese.alergias}
                  onChange={(e) => setAnamnese(prev => ({ ...prev, alergias: e.target.value }))}
                  placeholder="Descreva alergias conhecidas (medicamentos, materiais, látex...)"
                  className="bg-gray-900 border-gray-800 text-white text-sm min-h-[70px]"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1.5 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-blue-400" /> Medicamentos em uso
                </label>
                <Textarea
                  value={anamnese.medicamentos}
                  onChange={(e) => setAnamnese(prev => ({ ...prev, medicamentos: e.target.value }))}
                  placeholder="Liste medicamentos que o paciente toma regularmente"
                  className="bg-gray-900 border-gray-800 text-white text-sm min-h-[70px]"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-2">Doenças crônicas</label>
                <div className="grid grid-cols-2 gap-2">
                  {doencasOptions.map(d => (
                    <label key={d} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={anamnese.doencas_cronicas.includes(d)}
                        onChange={(e) => {
                          setAnamnese(prev => ({
                            ...prev,
                            doencas_cronicas: e.target.checked
                              ? [...prev.doencas_cronicas, d]
                              : prev.doencas_cronicas.filter(x => x !== d)
                          }))
                        }}
                        className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 accent-amber-500"
                      />
                      <span className="text-gray-300 text-xs">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1.5">Cirurgias prévias</label>
                <Textarea
                  value={anamnese.cirurgias_previas}
                  onChange={(e) => setAnamnese(prev => ({ ...prev, cirurgias_previas: e.target.value }))}
                  placeholder="Descreva cirurgias anteriores relevantes"
                  className="bg-gray-900 border-gray-800 text-white text-sm min-h-[60px]"
                />
              </div>
              <Separator className="border-gray-800" />
              <div className="flex gap-6">
                {[
                  { key: 'fumante' as const, label: 'Fumante' },
                  { key: 'etilista' as const, label: 'Etilista' },
                  { key: 'gravidez' as const, label: 'Gestante' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anamnese[opt.key]}
                      onChange={(e) => setAnamnese(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 accent-amber-500"
                    />
                    <span className="text-gray-300 text-xs">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1.5">Observações adicionais</label>
                <Textarea
                  value={anamnese.observacoes}
                  onChange={(e) => setAnamnese(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Outras informações relevantes para o tratamento"
                  className="bg-gray-900 border-gray-800 text-white text-sm min-h-[70px]"
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Salvar anamnese
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Odontograma */}
          {activeTab === 2 && <Odontograma />}

          {/* Tab 3: Plano de Tratamento */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Plano de Tratamento</h3>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white text-xs gap-1">
                  <Plus className="w-3 h-3" /> Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {plano.map(item => (
                  <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{item.procedimento}</span>
                        {item.dente !== '—' && <span className="text-gray-600 text-xs">Dente {item.dente}</span>}
                      </div>
                      <span className="text-gray-500 text-xs">{formatDate(item.data)}</span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{formatCurrency(item.valor)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${planoStatusColor[item.status]}`}>
                      {item.status === 'pendente' ? 'Pendente' : item.status === 'em_andamento' ? 'Em andamento' : 'Concluído'}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="border-gray-800" />
              <div className="flex items-center justify-between px-1">
                <span className="text-gray-400 text-sm font-medium">Total do plano</span>
                <span className="text-white text-lg font-bold">{formatCurrency(plano.reduce((s, i) => s + i.valor, 0))}</span>
              </div>
            </div>
          )}

          {/* Tab 4: Financeiro */}
          {activeTab === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total tratamento', value: formatCurrency(5030), color: 'text-white' },
                  { label: 'Pago', value: formatCurrency(180), color: 'text-green-400' },
                  { label: 'Saldo devedor', value: formatCurrency(4850), color: 'text-red-400' },
                ].map((k, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                    <p className="text-gray-500 text-[10px] mb-1">{k.label}</p>
                    <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Pagamentos registrados</h4>
                <div className="space-y-2">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">Limpeza Profilática</p>
                      <p className="text-gray-600 text-xs">15/03/2026 · Cartão crédito</p>
                    </div>
                    <span className="text-green-400 font-semibold text-sm">{formatCurrency(180)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-gray-400 text-xs font-semibold mb-3 uppercase tracking-wider">Propostas</h4>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Implante + Restauração</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Em análise</span>
                  </div>
                  <p className="text-gray-500 text-xs">12x de {formatCurrency(404.17)} · Entrada {formatCurrency(0)}</p>
                  <p className="text-gray-300 text-sm font-semibold mt-1">Total: {formatCurrency(4850)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Documentos */}
          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Documentos</h3>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white text-xs gap-1">
                  <Upload className="w-3 h-3" /> Upload
                </Button>
              </div>
              {/* Drop zone */}
              <div className="border-2 border-dashed border-gray-800 hover:border-amber-500/40 rounded-2xl p-10 text-center transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-gray-600 text-xs mt-1">PDF, DOC, JPG, PNG — até 10MB</p>
              </div>
              {/* Empty state */}
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-800 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Nenhum documento anexado</p>
              </div>
            </div>
          )}

          {/* Tab 6: Radiografias */}
          {activeTab === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Radiografias</h3>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white text-xs gap-1">
                  <Upload className="w-3 h-3" /> Upload
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-800 hover:border-amber-500/40 rounded-2xl p-10 text-center transition-colors cursor-pointer">
                <Image className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-medium">Arraste radiografias aqui</p>
                <p className="text-gray-600 text-xs mt-1">JPG, PNG, DICOM — até 25MB</p>
              </div>
              {/* Thumbnail grid placeholder */}
              <div className="grid grid-cols-3 gap-3">
                {['Panorâmica', 'Periapical 36', 'Periapical 46'].map((label, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-gray-700 transition cursor-pointer">
                    <Image className="w-8 h-8 text-gray-700" />
                    <span className="text-gray-500 text-[10px]">{label}</span>
                    <span className="text-gray-700 text-[9px]">15/03/2026</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Histórico */}
          {activeTab === 7 && (
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-sm mb-4">Histórico do paciente</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-800" />
                <div className="space-y-0">
                  {historico.map((item, i) => (
                    <div key={item.id} className="relative pl-10 py-3">
                      <div className="absolute left-2.5 top-4 w-3 h-3 rounded-full bg-gray-800 border-2 border-gray-700 z-10" />
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm">{historicoIcon[item.tipo] || '📌'}</span>
                            <span className="text-white text-sm">{item.descricao}</span>
                          </div>
                          <span className="text-gray-600 text-xs">{formatDate(item.data)} · {new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 8: Agendamentos */}
          {activeTab === 8 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Agendamentos</h3>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white text-xs gap-1">
                  <Plus className="w-3 h-3" /> Novo agendamento
                </Button>
              </div>
              <div className="space-y-2">
                {agendamentos.map(ag => (
                  <div key={ag.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex flex-col items-center justify-center">
                        <span className="text-amber-400 text-xs font-bold leading-none">{new Date(ag.data + 'T00:00:00').getDate()}</span>
                        <span className="text-gray-600 text-[9px]">{['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][new Date(ag.data + 'T00:00:00').getMonth()]}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{ag.procedimento}</p>
                        <p className="text-gray-600 text-xs">{ag.hora}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${agendamentoStatusColor[ag.status] || 'bg-gray-800 text-gray-500'}`}>
                      {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 9: Observações */}
          {activeTab === 9 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-sm">Observações</h3>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Anotações livres sobre o paciente..."
                className="bg-gray-900 border-gray-800 text-white text-sm min-h-[250px]"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">{observacoes.length} caracteres</span>
                <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Salvar
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    supabase.from('pacientes').select('*').order('nome').then(({ data }) => {
      if (data) setPacientes(data as Paciente[])
      setLoading(false)
    })

    const ch = supabase.channel('pacientes-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pacientes' }, () => {
        supabase.from('pacientes').select('*').order('nome').then(({ data }) => {
          if (data) setPacientes(data as Paciente[])
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const filtrados = useMemo(() =>
    pacientes.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.telefone && p.telefone.includes(busca)) ||
      (p.cpf && p.cpf.includes(busca)) ||
      (p.procedimento && p.procedimento.toLowerCase().includes(busca.toLowerCase()))
    ),
    [pacientes, busca]
  )

  const kpis = useMemo(() => {
    const now = new Date()
    const mesAtual = now.getMonth()
    const anoAtual = now.getFullYear()
    const ativos = pacientes.filter(p => p.status === 'ativo').length
    const emTratamento = pacientes.filter(p => p.status === 'em_tratamento').length
    const novosMes = pacientes.filter(p => {
      const d = new Date(p.created_at)
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
    }).length
    return { total: pacientes.length, ativos, emTratamento, novosMes }
  }, [pacientes])

  const openPatient = useCallback((p: Paciente) => {
    setSelectedPaciente(p)
    setSheetOpen(true)
  }, [])

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
            <span>⚔️</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400">Pacientes</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Pacientes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestão completa do cadastro de pacientes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, CPF, telefone..."
              className="w-72 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 placeholder-gray-600 transition"
            />
          </div>
          <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-sm gap-1.5 h-10 px-4 rounded-xl">
            <Plus className="w-4 h-4" /> Novo Paciente
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total pacientes', value: kpis.total, icon: <Users className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Ativos', value: kpis.ativos, icon: <UserCheck className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Em tratamento', value: kpis.emTratamento, icon: <Activity className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Novos este mês', value: kpis.novosMes, icon: <UserPlus className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Patient Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Carregando pacientes...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-gray-800 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              {busca ? 'Nenhum paciente encontrado para esta busca' : 'Nenhum paciente cadastrado'}
            </p>
            <p className="text-gray-700 text-xs mt-1">
              {busca ? 'Tente alterar os termos de busca' : 'Clique em "+ Novo Paciente" para começar'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider pl-5">Paciente</TableHead>
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Telefone</TableHead>
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Procedimento</TableHead>
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Cadastro</TableHead>
                <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wider text-right pr-5">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map(p => (
                <TableRow
                  key={p.id}
                  className="border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition"
                  onClick={() => openPatient(p)}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/10 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
                        {p.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.nome}</p>
                        {p.email && <p className="text-gray-600 text-xs">{p.email}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-300 text-sm">
                      {p.telefone ? formatPhone(p.telefone) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400 text-sm">{p.procedimento || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${getStatusColor(p.status)}`}>
                      {getStatusLabel(p.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-500 text-sm">{formatDate(p.created_at)}</span>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              onClick={(e) => { e.stopPropagation(); openPatient(p) }}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-amber-400 hover:bg-gray-800 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-gray-800 transition"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Table footer */}
        {filtrados.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between">
            <span className="text-gray-600 text-xs">{filtrados.length} paciente{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg text-gray-500 text-xs hover:bg-gray-800 transition">Anterior</button>
              <button className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-medium">1</button>
              <button className="px-3 py-1.5 rounded-lg text-gray-500 text-xs hover:bg-gray-800 transition">Próximo</button>
            </div>
          </div>
        )}
      </div>

      {/* Patient detail Sheet */}
      <PatientSheet
        paciente={selectedPaciente}
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setSelectedPaciente(null) }}
      />
    </div>
  )
}
