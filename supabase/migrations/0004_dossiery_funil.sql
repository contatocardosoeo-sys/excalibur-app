-- ============================================================================
-- DOSSIERY — Funil completo (upsell/downsell/cross-sell) + endurecimento RLS
-- Idempotente.
-- ============================================================================

-- Protocolo Encontro (upsell pós-compra / cross-sell in-app) — vitalício.
alter table dossiery_assinaturas
  add column if not exists protocolo_encontro boolean not null default false;

-- ---------------------------------------------------------------------------
-- SEGURANÇA: dossiery_assinaturas vira SOMENTE-LEITURA para o usuário.
-- A policy antiga (dono_all FOR ALL) deixava o próprio usuário dar UPDATE na
-- linha dele via PostgREST (anon key) — ou seja, setar plano/status/renova_em
-- e furar o paywall. Escrita agora é exclusiva do service role
-- (webhook Stripe + rotas de upsell), que ignora RLS.
-- ---------------------------------------------------------------------------
drop policy if exists dono_all on dossiery_assinaturas;
drop policy if exists dono_select on dossiery_assinaturas;
create policy dono_select on dossiery_assinaturas
  for select using (user_id = auth.uid());
