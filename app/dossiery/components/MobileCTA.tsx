'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Barra de CTA fixa no mobile — aparece depois que o CTA do hero sai da tela.
// A maior alavanca de conversão em tráfego frio mobile: a saída sempre no polegar.
export default function MobileCTA() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const alvo = document.getElementById('cta-hero')
    if (!alvo) {
      setVisivel(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => setVisivel(!e.isIntersecting && window.scrollY > 250),
      { threshold: 0 }
    )
    io.observe(alvo)
    return () => io.disconnect()
  }, [])

  if (!visivel) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 pt-3"
      style={{ paddingBottom: 'calc(0.65rem + env(safe-area-inset-bottom))' }}
    >
      <Link
        href="/dossiery/precos"
        className="block text-center rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3.5 active:opacity-90"
      >
        Entrar no Protocolo — R$97/mês →
      </Link>
      <p className="mt-1.5 text-center font-mono-d text-[9px] tracking-[0.14em] uppercase text-muted-foreground/70">
        7 dias de garantia · cancele em 2 cliques
      </p>
    </div>
  )
}
