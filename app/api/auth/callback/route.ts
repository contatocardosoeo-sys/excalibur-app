import { createSupabaseServer } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseServer()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Honra ?next= relativo (usado pelo Dossiery); default mantém a clínica
  const next = searchParams.get('next')
  const destino = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  return NextResponse.redirect(`${origin}${destino}`)
}
