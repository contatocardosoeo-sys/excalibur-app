import type { SupabaseClient } from '@supabase/supabase-js'

// ♠ Conta criada a partir da compra (guest checkout).
// O cara compra primeiro e ganha a conta depois: exigir cadastro ANTES do
// pagamento custa de 20% a 35% da conversão em mobile (Baymard, estimado).

// Acha o usuário pelo e-mail ou cria na hora. Devolve o id.
export async function acharOuCriarUsuario(
  admin: SupabaseClient,
  email: string
): Promise<string | null> {
  const limpo = email.trim().toLowerCase()

  const { data: criado } = await admin.auth.admin.createUser({
    email: limpo,
    email_confirm: true, // veio de pagamento confirmado: e-mail é válido
  })
  if (criado?.user?.id) return criado.user.id

  // Já existia: o generateLink devolve o usuário sem precisar varrer a base.
  const { data: link } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: limpo,
  })
  return link?.user?.id ?? null
}

// Gera o token de entrada sem senha. Usado na ponte pós-compra
// (/dossiery/entrando), pra ele cair logado direto na esteira.
export async function tokenDeEntrada(
  admin: SupabaseClient,
  email: string
): Promise<string | null> {
  const { data } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: email.trim().toLowerCase(),
  })
  return data?.properties?.hashed_token ?? null
}
