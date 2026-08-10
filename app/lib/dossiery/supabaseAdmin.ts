import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client com service_role (ignora RLS) — SÓ para uso server-side (webhooks).
// Instanciação preguiçosa para não quebrar o build sem envs.
let _admin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin não configurado (URL/SERVICE_ROLE_KEY)')
  if (!_admin) {
    _admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _admin
}
