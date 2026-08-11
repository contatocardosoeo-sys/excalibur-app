'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { createSupabaseBrowser } from '@/app/lib/supabase-browser'

function CriarContaForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/dossiery/precos'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [confirmarEmail, setConfirmarEmail] = useState(false)

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setErro(null)
    setLoading(true)
    try {
      if (senha.length < 8) throw new Error('Senha precisa de pelo menos 8 caracteres.')
      const supabase = createSupabaseBrowser()
      const destino = next.startsWith('/') ? next : '/dossiery/precos'
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(destino)}`,
        },
      })
      if (error) throw new Error(error.message)

      if (data.session) {
        // Confirmação de e-mail desligada → sessão imediata
        router.push(destino)
        router.refresh()
      } else {
        // Confirmação ligada → orienta a checar o e-mail
        setConfirmarEmail(true)
        setLoading(false)
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao criar conta')
      setLoading(false)
    }
  }

  if (confirmarEmail) {
    return (
      <div className="text-center py-4">
        <div className="font-serif-d text-3xl">✉</div>
        <p className="font-serif-d text-lg mt-3">Confirma teu e-mail</p>
        <p className="text-[13px] text-muted-foreground mt-2">
          Enviamos um link para <span className="text-foreground">{email}</span>. Clica nele e você
          cai direto de volta aqui.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={criar} className="space-y-4">
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
          Senha (mín. 8)
        </label>
        <input
          type="password"
          required
          minLength={8}
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
        {loading ? 'Criando…' : 'Criar conta →'}
      </button>
      <p className="text-center text-[13px] text-muted-foreground">
        Já tem conta?{' '}
        <Link
          href={`/dossiery/entrar?next=${encodeURIComponent(next)}`}
          className="d-toque text-[hsl(var(--brass))] hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}

export default function CriarContaPage() {
  return (
    <div className="min-h-screen d-grid-bg grid place-items-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/dossiery" className="flex items-center justify-center gap-2 mb-8 min-h-[44px]">
          <span className="text-primary text-xl leading-none">♠</span>
          <span className="font-serif-d text-2xl tracking-tight">Dossiery</span>
        </Link>
        <div className="rounded-lg border border-border bg-card/60 p-7">
          <h1 className="font-serif-d text-2xl">Criar conta</h1>
          <p className="text-[13px] text-muted-foreground mt-1 mb-6">
            Seu dossiê começa aqui.
          </p>
          <Suspense fallback={null}>
            <CriarContaForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
