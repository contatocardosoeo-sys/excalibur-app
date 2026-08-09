'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dossiery/base', n: '01', label: 'Base' },
  { href: '/dossiery/coach', n: '02', label: 'Coach' },
  { href: '/dossiery/analisar', n: '03', label: 'Analisar' },
  { href: '/dossiery/arena', n: '04', label: 'Arena' },
  { href: '/dossiery/conexoes', n: '05', label: 'Conexões' },
  { href: '/dossiery/campo', n: '06', label: 'Campo' },
  { href: '/dossiery/academia', n: '07', label: 'Academia' },
  { href: '/dossiery/evolucao', n: '08', label: 'Evolução' },
  { href: '/dossiery/conta', n: '09', label: 'Conta' },
]

export default function DossierySidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link href="/dossiery" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-8 h-8 rounded-[3px] border border-[hsl(var(--brass))] text-[hsl(var(--brass))] font-serif-d text-lg leading-none group-hover:bg-primary/10 transition">
            D
          </span>
          <div>
            <div className="font-serif-d text-[15px] tracking-tight text-foreground leading-none">
              Dossiery
            </div>
            <div className="font-mono-d text-[9px] tracking-[0.22em] uppercase text-muted-foreground mt-1">
              Projeto Conquista
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-auto py-3 px-2.5 flex flex-col gap-0.5">
        {nav.map(({ href, n, label }) => {
          const active = pathname === href || pathname?.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-[4px] px-3 py-2 text-[13px] transition ${
                active
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              }`}
            >
              <span
                className={`font-mono-d text-[10px] ${
                  active
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground/60 group-hover:text-[hsl(var(--brass))]'
                }`}
              >
                {n}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center w-8 h-8 rounded-full bg-primary/15 text-[hsl(var(--brass))] font-serif-d text-sm">
            O
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-foreground font-medium truncate">Operador</div>
            <div className="font-mono-d text-[9px] tracking-widest uppercase text-muted-foreground">
              Acesso · Fase 0
            </div>
          </div>
          <Link
            href="/dossiery"
            className="text-muted-foreground hover:text-primary text-sm transition"
            title="Sair"
          >
            ↪
          </Link>
        </div>
      </div>
    </aside>
  )
}
