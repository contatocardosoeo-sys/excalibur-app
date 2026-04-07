import { createSupabaseBrowser } from './supabase-browser'

// Re-export para compatibilidade com páginas existentes
export const supabase = createSupabaseBrowser()
