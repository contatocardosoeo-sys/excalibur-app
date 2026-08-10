-- ============================================================================
-- DOSSIERY — Billing (S2)
-- Complementa dossiery_assinaturas para integração Stripe.
-- Idempotente: pode rodar depois (ou junto) da 0001.
-- ============================================================================

alter table dossiery_assinaturas
  add column if not exists stripe_customer_id text;

create index if not exists idx_assinaturas_stripe_id
  on dossiery_assinaturas(stripe_id);

create index if not exists idx_assinaturas_stripe_customer
  on dossiery_assinaturas(stripe_customer_id);

-- Status usados pelo webhook: 'ativo' | 'atrasado' | 'cancelado'
-- Plano no MVP: 'operador' (ciclo mensal ou anual definido no Stripe)
