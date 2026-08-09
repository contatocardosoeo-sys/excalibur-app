-- ============================================================================
-- DOSSIERY — Schema + RLS (Fase 0)
-- Coach de conquista: dados isolados POR USUÁRIO (não por clínica).
-- Rode no SQL Editor do Supabase. Requer a extensão pgvector para o RAG.
--
-- Convenção: toda tabela de usuário tem user_id -> auth.users e RLS
-- com a política user_id = auth.uid(). Tabelas do cânone (kb_*) são
-- compartilhadas: leitura para autenticados, escrita só via service_role.
-- ============================================================================

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- Helper: mantém updated_at
-- ---------------------------------------------------------------------------
create or replace function dossiery_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 01 · Perfil do atleta (1:1 com o usuário)
-- ---------------------------------------------------------------------------
create table if not exists dossiery_perfis (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  nome           text,
  objetivo       text,                       -- namoro | casual | confiança | ...
  arquetipo      text,
  forcas         text[] default '{}',
  travas         text[] default '{}',
  estilo_flerte  text,                        -- Hall: físico | tradicional | sincero | ...
  contexto       text,
  preferencias   jsonb default '{}'::jsonb,   -- tom do coach, intensidade do feedback
  criado_em      timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 05 · Conexões (CRM pessoal — anotações privadas do usuário)
-- ---------------------------------------------------------------------------
create table if not exists dossiery_conexoes (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  apelido              text not null,
  onde_conheceu        text,
  etapa                text default 'novo',   -- novo | conversando | encontro | ...
  interesse_percebido  smallint,              -- 0..5 (leitura do usuário)
  notas                text,
  links_publicos       text[] default '{}',   -- opcional; minimização por padrão
  criado_em            timestamptz default now(),
  updated_at           timestamptz default now()
);
create index if not exists idx_conexoes_user on dossiery_conexoes(user_id);

-- ---------------------------------------------------------------------------
-- 03 · Interações analisadas (as SUAS conversas + feedback da IA)
-- ---------------------------------------------------------------------------
create table if not exists dossiery_interacoes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  conexao_id    uuid references dossiery_conexoes(id) on delete set null,
  canal         text,                          -- whatsapp | instagram | app | ...
  conteudo      text not null,                 -- transcrição colada pelo usuário
  diagnostico   text,
  sugestoes     jsonb default '[]'::jsonb,     -- respostas editáveis na voz do usuário
  criado_em     timestamptz default now()
);
create index if not exists idx_interacoes_user on dossiery_interacoes(user_id);

-- ---------------------------------------------------------------------------
-- 02 · Coach — threads e mensagens
-- ---------------------------------------------------------------------------
create table if not exists dossiery_conversas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  titulo     text,
  criado_em  timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_conversas_user on dossiery_conversas(user_id);

create table if not exists dossiery_mensagens (
  id          uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references dossiery_conversas(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  papel       text not null check (papel in ('user','assistant','system')),
  conteudo    text not null,
  citacoes    jsonb default '[]'::jsonb,       -- fontes do cânone recuperadas
  criado_em   timestamptz default now()
);
create index if not exists idx_mensagens_conversa on dossiery_mensagens(conversa_id);
create index if not exists idx_mensagens_user on dossiery_mensagens(user_id);

-- ---------------------------------------------------------------------------
-- 04 · Practice Arena — sessões de roleplay
-- ---------------------------------------------------------------------------
create table if not exists dossiery_sessoes_arena (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  cenario     text not null,
  transcript  jsonb default '[]'::jsonb,
  heatmap     jsonb default '{}'::jsonb,       -- calibração/escuta/clareza/presença
  nota        smallint,
  criado_em   timestamptz default now()
);
create index if not exists idx_arena_user on dossiery_sessoes_arena(user_id);

-- ---------------------------------------------------------------------------
-- 06 · Diário de campo — interações reais + debrief
-- ---------------------------------------------------------------------------
create table if not exists dossiery_campo (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  conexao_id  uuid references dossiery_conexoes(id) on delete set null,
  resumo      text not null,
  resultado   text,
  licao       text,
  debrief_ia  text,
  criado_em   timestamptz default now()
);
create index if not exists idx_campo_user on dossiery_campo(user_id);

-- ---------------------------------------------------------------------------
-- Cadência — lembretes/sugestões PARA o usuário (nunca auto-envio)
-- ---------------------------------------------------------------------------
create table if not exists dossiery_cadencias (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  conexao_id  uuid references dossiery_conexoes(id) on delete cascade,
  quando      timestamptz not null,
  sugestao_ia text,
  status      text default 'pendente',         -- pendente | feito | descartado
  criado_em   timestamptz default now()
);
create index if not exists idx_cadencias_user on dossiery_cadencias(user_id);

-- ---------------------------------------------------------------------------
-- 08 · Progresso / gamificação
-- ---------------------------------------------------------------------------
create table if not exists dossiery_progresso (
  user_id      uuid not null references auth.users(id) on delete cascade,
  skill        text not null,                  -- escuta | calibracao | storytelling | ...
  xp           integer default 0,
  streak       integer default 0,
  updated_at   timestamptz default now(),
  primary key (user_id, skill)
);

create table if not exists dossiery_missoes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  tipo       text not null,
  estado     text default 'aberta',            -- aberta | concluida | expirada
  criado_em  timestamptz default now()
);
create index if not exists idx_missoes_user on dossiery_missoes(user_id);

-- ---------------------------------------------------------------------------
-- Billing
-- ---------------------------------------------------------------------------
create table if not exists dossiery_assinaturas (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  plano       text default 'recruta',           -- recruta | operador | comandante
  status      text default 'ativo',
  stripe_id   text,
  renova_em   timestamptz,
  updated_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- RAG — cânone compartilhado (não é dado de usuário)
-- ---------------------------------------------------------------------------
create table if not exists dossiery_kb_documentos (
  id             uuid primary key default gen_random_uuid(),
  titulo         text not null,
  autor          text,
  evidence_level text,                           -- empirico | clinico | pratico | filosofico
  criado_em      timestamptz default now()
);

create table if not exists dossiery_kb_chunks (
  id                 uuid primary key default gen_random_uuid(),
  doc_id             uuid references dossiery_kb_documentos(id) on delete cascade,
  text               text not null,
  source_title       text,
  source_author      text,
  evidence_level     text,
  domain             text[] default '{}',
  stage              text[] default '{}',
  situation          text[] default '{}',
  skill              text[] default '{}',
  concept            text[] default '{}',
  ethics_status      text default 'healthy',     -- healthy | anti_pattern
  one_line_principle text,
  actionable_step    text,
  embedding          vector(1536)                -- dim depende do modelo de embedding
);
-- HNSW funciona em tabela vazia (ivfflat exige dados pra calibrar as listas)
create index if not exists idx_kb_chunks_embedding
  on dossiery_kb_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists idx_kb_chunks_ethics on dossiery_kb_chunks(ethics_status);

-- ---------------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'dossiery_perfis','dossiery_conexoes','dossiery_conversas',
    'dossiery_progresso','dossiery_assinaturas'
  ] loop
    execute format(
      'drop trigger if exists trg_touch on %I; create trigger trg_touch
       before update on %I for each row execute function dossiery_touch_updated_at();',
      t, t
    );
  end loop;
end $$;

-- ===========================================================================
-- RLS
-- ===========================================================================

-- Tabelas de usuário: dono vê/edita só o que é seu ---------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'dossiery_perfis','dossiery_conexoes','dossiery_interacoes',
    'dossiery_conversas','dossiery_mensagens','dossiery_sessoes_arena',
    'dossiery_campo','dossiery_cadencias','dossiery_progresso',
    'dossiery_missoes','dossiery_assinaturas'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists dono_all on %I;', t);
    execute format(
      'create policy dono_all on %I for all
         using (user_id = auth.uid())
         with check (user_id = auth.uid());',
      t
    );
  end loop;
end $$;

-- Cânone: leitura para autenticados; escrita só service_role ------------------
alter table dossiery_kb_documentos enable row level security;
alter table dossiery_kb_chunks     enable row level security;

drop policy if exists kb_docs_read on dossiery_kb_documentos;
create policy kb_docs_read on dossiery_kb_documentos
  for select to authenticated using (true);

drop policy if exists kb_chunks_read on dossiery_kb_chunks;
create policy kb_chunks_read on dossiery_kb_chunks
  for select to authenticated using (true);

-- (sem policy de INSERT/UPDATE/DELETE → apenas o service_role escreve no cânone)

-- ===========================================================================
-- FIM — Fase 0
-- ===========================================================================
