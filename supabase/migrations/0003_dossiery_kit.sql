-- ============================================================================
-- DOSSIERY — Kit 50 Aberturas (order bump) — entitlement
-- Idempotente.
-- ============================================================================

alter table dossiery_assinaturas
  add column if not exists kit_aberturas boolean not null default false;

-- Quem comprou o bump ganha kit_aberturas = true via webhook (nunca volta a false).
