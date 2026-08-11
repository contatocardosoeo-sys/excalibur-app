-- ═══════════════════════════════════════════════════════════════════════
-- 0007 · Medição de consumo de IA + tier real do plano
--
-- Dois problemas que a auditoria de precificação encontrou:
--
-- 1. O webhook gravava plano='operador' para TODOS os tiers pagos. Quem paga
--    R$97/mês e quem paga R$497/ano ficavam idênticos no banco, então não dava
--    para medir margem por plano nem aplicar limite de uso por tier.
--
-- 2. Raio-X e Coach são vendidos como ilimitados, sem nenhum registro de
--    consumo. O custo do usuário pesado só aparecia na fatura da Anthropic.
--    Sem isso, a premissa de mix de uso do estudo continua sendo palpite.
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Tier real na assinatura ─────────────────────────────────────────
alter table public.dossiery_assinaturas
  add column if not exists tier text;

comment on column public.dossiery_assinaturas.tier is
  'Tier comprado: recruta (mensal R$97) | operador (anual) | comandante (único). '
  'Distinto de plano, que só diz se o acesso está liberado.';

-- Assinaturas que já existem viraram operador por padrão do webhook antigo.
update public.dossiery_assinaturas
   set tier = 'operador'
 where tier is null and plano = 'operador';

-- ── 2. Consumo de IA por chamada ───────────────────────────────────────
create table if not exists public.dossiery_uso (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  recurso      text not null check (recurso in ('coach', 'analisar')),
  entrada      integer not null default 0,
  saida        integer not null default 0,
  cache_lido   integer not null default 0,
  cache_escrito integer not null default 0,
  modelo       text,
  criado_em    timestamptz not null default now()
);

comment on table public.dossiery_uso is
  'Uma linha por chamada de IA. Base para custo real por usuário e para o '
  'limite de uso justo. Escrita exclusiva do service-role.';

-- O limite consulta "quantas chamadas deste usuário nos últimos 30 dias",
-- então o índice precisa cobrir user_id + recurso + data.
create index if not exists dossiery_uso_user_recurso_data
  on public.dossiery_uso (user_id, recurso, criado_em desc);

alter table public.dossiery_uso enable row level security;

-- Mesma regra da 0004: o dono LÊ, ninguém escreve pelo PostgREST. Sem isso
-- um usuário poderia apagar o próprio consumo e furar o limite.
drop policy if exists dossiery_uso_dono_leitura on public.dossiery_uso;
create policy dossiery_uso_dono_leitura
  on public.dossiery_uso
  for select
  using (auth.uid() = user_id);
