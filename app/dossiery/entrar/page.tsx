'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { createSupabaseBrowser } from '@/app/lib/supabase-browser'

function EntrarForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/dossiery/base'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setErro(null)
    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) throw new Error('E-mail ou senha incorretos.')
      router.push(next.startsWith('/') ? next : '/dossiery/base')
      router.refresh()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao entrar')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={entrar} className="space-y-4">
      <div>
        <label className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          E-mail
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-[4px] border border-border bg-card px-4 py-3 text-[14px] outline-none focus:border-primary transition"
        />
      </div>
      <div>
        <label className="font-mono-d text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          Senha
        </label>
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mt-2 w-full rounded-[4px] border border-border bg-card px-4 py-3 text-[14px] outline-none focus:border-primary transition"
        />
      </div>
      {erro && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-[12.5px] text-destructive">
          {erro}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[4px] bg-primary text-primary-foreground font-semibold text-[15px] py-3 hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Entrando…' : 'Entrar →'}
      </button>
      <p className="text-center text-[13px] text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          href={`/dossiery/criar-conta?next=${encodeURIComponent(next)}`}
          className="text-primary hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}

export default function EntrarPage() {
  return (
    <div className="min-h-screen d-grid-bg grid place-items-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/dossiery" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-primary text-xl leading-none">♠</span>
          <span className="font-serif-d text-2xl tracking-tight">Dossiery</span>
        </Link>
        <div className="rounded-lg border border-border bg-card/60 p-7">
          <h1 className="font-serif-d text-2xl">Entrar</h1>
          <p className="text-[13px] text-muted-foreground mt-1 mb-6">
            De volta ao jogo, Operador.
          </p>
          <Suspense fallback={null}>
            <EntrarForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
