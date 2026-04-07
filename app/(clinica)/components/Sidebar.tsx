'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../lib/supabase-browser'

interface Perfil {
  nome: string
  role: string
  avatar_url: string | null
}

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/crm', icon: '👥', label: 'Leads / CRM' },
  { href: '/pacientes', icon: '🦷', label: 'Pacientes' },
  { href: '/agenda', icon: '📅', label: 'Agenda' },
  { href: '/financeiro', icon: '💰', label: 'Financeiro' },
  { href: '/marketing', icon: '📣', label: 'Marketing' },
  { href: '/bi', icon: '📈', label: 'BI & Analise' },
  { href: '/academia', icon: '🎓', label: 'Academia' },
]

const ROLES: Record<string, string> = {
  dono: 'Proprietário',
  gerente: 'Gerente',
  dentista: 'Dentista',
  atendente: 'Atendente',
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || '')
        supabase
          .from('perfis')
          .select('nome, role, avatar_url')
          .eq('user_id', data.user.id)
          .single()
          .then(({ data: p }) => {
            if (p) setPerfil(p)
          })
      }
    })
  }, [])

  const nome = perfil?.nome || email.split('@')[0] || 'Usuário'
  const iniciais = nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  const role = perfil?.role ? ROLES[perfil.role] || perfil.role : 'Usuário'

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="w-56 bg-[#0a0a12] border-r border-[#1e1e2e] flex flex-col shrink-0">
      <div className="p-5 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <div>
            <h1 className="text-white font-bold text-sm">Excalibur</h1>
            <p className="text-gray-500 text-[10px]">Sistema Odontológico</p>
          </div>
        </div>
      </div>
      <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-auto">
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition ${
              pathname?.startsWith(href)
                ? 'bg-amber-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:bg-[#13131f] hover:text-white'
            }`}>
            <span className="text-sm">{icon}</span> {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{nome}</p>
            <p className="text-gray-500 text-[10px]">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-400 transition text-xs p-1"
            title="Sair"
          >
            ↪
          </button>
        </div>
      </div>
    </div>
  )
}
