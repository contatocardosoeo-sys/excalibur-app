-- ============================================================================
-- DOSSIERY — Guest checkout, WhatsApp no lead e ciclo de renovação
-- Idempotente.
-- ============================================================================

-- Guest checkout: o e-mail da compra vira a chave da conta criada no webhook.
alter table dossiery_assinaturas
  add column if not exists email text,
  -- Marca que o D330 (aviso de renovação) já foi disparado, pra não repetir.
  add column if not exists renovacao_avisada_em timestamptz;

create index if not exists dossiery_assinaturas_renova_idx
  on dossiery_assinaturas (renova_em)
  where status = 'ativo';

-- WhatsApp opcional no lead do quiz (o BR responde muito mais no zap que no e-mail).
alter table dossiery_leads
  add column if not exists whatsapp text;
