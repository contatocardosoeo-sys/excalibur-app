import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hluhlsnodndpskrkbjuw.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ============ DOSSIERY (funil próprio, auth própria) ============
  if (pathname === '/dossiery' || pathname.startsWith('/dossiery/')) {
    // DOSSIERY_GATE=off → tudo aberto (preview/dev antes do go-live)
    const gateOff = process.env.DOSSIERY_GATE === 'off'
    const publicosDossiery = [
      '/dossiery',
      '/dossiery/precos',
      '/dossiery/entrar',
      '/dossiery/criar-conta',
      '/dossiery/bem-vindo',
      '/dossiery/termos',
      '/dossiery/privacidade',
    ]
    const isPublicoDossiery = publicosDossiery.includes(pathname)

    // Logado tentando entrar/criar conta → manda pra Base
    if (user && (pathname === '/dossiery/entrar' || pathname === '/dossiery/criar-conta')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dossiery/base'
      url.search = ''
      return NextResponse.redirect(url)
    }

    // App protegido sem login → login com retorno
    if (!user && !isPublicoDossiery && !gateOff) {
      const url = request.nextUrl.clone()
      url.pathname = '/dossiery/entrar'
      url.search = `?next=${encodeURIComponent(pathname)}`
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // ============ CLÍNICA (comportamento original) ============
  // Rotas públicas — não precisa de auth
  const publicRoutes = ['/', '/login', '/api/webhooks']
  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // Se não está logado e tenta acessar rota protegida → redireciona para login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Se está logado e tenta acessar login → redireciona para dashboard
  if (user && (pathname === '/' || pathname === '/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
