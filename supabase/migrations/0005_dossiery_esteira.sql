-- ============================================================================
-- DOSSIERY — Esteira completa: leads do quiz + produtos novos
-- Idempotente.
-- ============================================================================

-- Entitlements dos produtos novos (vitalícios; liberados por webhook/upsell).
alter table dossiery_assinaturas
  add column if not exists plano_7d boolean not null default false,
  add column if not exists perfil_magnetico boolean not null default false,
  add column if not exists recomeco boolean not null default false;

-- ---------------------------------------------------------------------------
-- Leads do quiz (Raio-X) — captura PRÉ-conta, topo do funil.
-- Sem policies de usuário: só o service role lê/escreve (rota /api/dossiery/lead).
-- ---------------------------------------------------------------------------
create table if not exists dossiery_leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  arquetipo  text,            -- B|E|F|G|P|O (Modo Trouxa dominante)
  score      int,             -- Índice Modo Trouxa 0-100
  respostas  jsonb,           -- respostas cruas p/ segmentação futura
  origem     text,            -- utm_source/campaign colado do client
  consent    boolean not null default false,  -- LGPD: aceite explícito
  criado_em  timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists dossiery_leads_email_uq
  on dossiery_leads (lower(email));

alter table dossiery_leads enable row level security;
-- (nenhuma policy de propósito: anon/authenticated não leem nem escrevem)
