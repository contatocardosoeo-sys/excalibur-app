'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_SECTIONS = [
  {
    title: 'Principal',
    items: [
      { href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4', label: 'Dashboard' },
    ],
  },
  {
    title: 'Vendas',
    items: [
      { href: '/crm', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Leads / CRM' },
      { href: '/oportunidades', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Oportunidades' },
      { href: '/propostas', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Propostas' },
      { href: '/time', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', label: 'Time Comercial' },
    ],
  },
  {
    title: 'Clínica',
    items: [
      { href: '/pacientes', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Pacientes' },
      { href: '/agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Agenda' },
      { href: '/procedimentos', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', label: 'Procedimentos' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { href: '/financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Financeiro' },
      { href: '/bi', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'BI & Análise' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { href: '/configuracoes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Configurações' },
    ],
  },
]

function SvgIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 transition-all duration-200`}>
      <div className={`p-4 border-b border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <span className="text-xl">⚔️</span>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Excalibur</h1>
            <p className="text-gray-600 text-[10px]">Sistema Odontológico</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">{section.title}</p>
            )}
            {section.items.map(({ href, icon, label }) => {
              const active = pathname === href || pathname?.startsWith(href + '/')
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? 'bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                  title={collapsed ? label : undefined}>
                  <SvgIcon d={icon} />
                  {!collapsed && label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300 text-xs transition">
          <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && 'Recolher'}
        </button>
      </div>
    </div>
  )
}
