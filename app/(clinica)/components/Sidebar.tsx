'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <div>
            <h1 className="text-white font-bold text-sm">Excalibur</h1>
            <p className="text-gray-500 text-[10px]">Clinica Demo</p>
          </div>
        </div>
      </div>
      <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-auto">
        {navItems.map(({ href, icon, label }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition ${
              pathname?.startsWith(href) ? 'bg-amber-500 text-gray-950 font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <span className="text-sm">{icon}</span> {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">MC</div>
          <div>
            <p className="text-white text-xs font-medium">Dr. Matheus</p>
            <p className="text-gray-500 text-[10px]">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  )
}
