# 03 · BANCO, SEGURANÇA E AMBIENTE

## As 7 migrações (rodar na ordem, SQL editor do Supabase)

0001_dossiery_schema.sql      base: assinaturas, leads
0002_dossiery_billing.sql     colunas de billing/stripe
0003_dossiery_kit.sql         entitlement kit_aberturas
0004_dossiery_funil.sql       ⚠ CORREÇÃO DE SEGURANÇA (ver abaixo) + protocolo_encontro
0005_dossiery_esteira.sql     leads + perfil_magnetico, recomeco, plano_7d
0006_dossiery_guest_renovacao.sql  email, renovacao_avisada_em, leads.whatsapp
0007_dossiery_uso_tier.sql    tier real + tabela dossiery_uso (medição de IA)

## A falha que a 0004 corrige (NUNCA reverter)

A política RLS original era `dono_all FOR ALL` em dossiery_assinaturas:
o usuário podia dar UPDATE na PRÓPRIA LINHA via PostgREST — ou seja, setar
plano='operador' e se dar acesso pago de graça, direto pela API pública.
A 0004 troca para SELECT-only. Escrita é exclusiva do service-role (webhook).
O mesmo padrão vale para dossiery_uso (0007): dono lê, ninguém escreve via
PostgREST — senão o usuário apagaria o próprio consumo e furaria o teto.

## Schema essencial — dossiery_assinaturas

user_id uuid PK → auth.users
plano text            acesso liberado? ('operador' = sim; 'recruta' default = NÃO)
tier text             o que COMPROU: 'recruta'|'operador'|'comandante' (0007)
status text           'ativo'|'cancelado'
renova_em timestamptz validade do anual (12 meses da compra)
stripe_id, stripe_customer_id
email text            para aviso de renovação
renovacao_avisada_em timestamptz
kit_aberturas, protocolo_encontro, perfil_magnetico, recomeco, plano_7d boolean

PEGADINHA: plano≠tier. plano diz SE tem acesso; tier diz O QUE comprou.
temAssinaturaAtiva() REJEITA plano='recruta' (é o default da tabela quando a
linha nasce só de um entitlement — não é plano pago).
Webhook grava plano='operador' para todo tier pago + tier com o valor real.

## dossiery_leads

email, whatsapp, consent boolean, score int, arq text, criado_em
Consent é obrigatório no front (LGPD) e o registro serve de prova.

## dossiery_uso (0007)

user_id, recurso 'coach'|'analisar', entrada, saida, cache_lido,
cache_escrito, modelo, criado_em + índice (user_id, recurso, criado_em desc)
Uma linha por chamada de IA. Base do custo real por usuário e do teto.
Teto: 300 chamadas/recurso/30 dias (uso.ts) — 5x o perfil pesado. Existe para
laço automatizado/conta compartilhada, não para cliente. 429 convida pro suporte.

## Webhook Stripe (app/api/webhooks/stripe/route.ts)

Eventos que PRECISAM estar cadastrados:
  checkout.session.completed              cartão
  checkout.session.async_payment_succeeded  ⚠ PIX (o que todo mundo esquece!)
  customer.subscription.updated           mensal
  customer.subscription.deleted           cancelamento
Sem o evento do PIX: pago no gateway, sem acesso no produto.

Fluxo do webhook: valida assinatura (STRIPE_WEBHOOK_SECRET) → ativarPorSession:
guest? acharOuCriarUsuario(email) cria a conta → upsert assinatura com plano,
tier, renova_em (+12 meses no anual), bump→kit_aberturas, comandante→tudo →
CAPI Purchase fire-and-forget.

## As 30 variáveis de ambiente

OBRIGATÓRIAS:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY (NUNCA no cliente), ANTHROPIC_API_KEY,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

OS 17 PREÇOS (imprime ao rodar node scripts/setup-stripe.mjs):
STRIPE_PRICE_MENSAL, _ANUAL, _ANUAL_T1, _ANUAL_T2, _ANUAL_T3, _COMANDANTE,
_BUMP, _PLANO7, _ENCONTRO_OTO, _ENCONTRO_DOWN, _ENCONTRO_APP, _PERFIL_OTO,
_PERFIL_APP, _RECOMECO_OTO, _RECOMECO_APP, _OPERADOR_CREDITO, _RENOVACAO

CRON: DOSSIERY_CRON_SECRET (protege /api/dossiery/renovacoes)
TRACKING: NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_TOKEN, NEXT_PUBLIC_GA4_ID

PERIGOSAS (só preview, NUNCA produção):
DOSSIERY_GATE=off      desliga login e paywall inteiros
DOSSIERY_PAYWALL=off   libera todo conteúdo pago
DOSSIERY_COACH_MODEL   troca o modelo (decisão do dono)

## Roteiro de teste (antes de 1 real de mídia)

A. Guest+cartão: aba anônima → /precos → Operador+bump → 4242... → conta criada
   sozinha → OTO1 aceita cobra em 1 clique → banco tem plano/tier/kit/encontro
B. Recusas: OTO1 recusa → downsell 47 aparece → recusa → perfil → bem-vindo
C. PIX: tripwire 19 no PIX → acesso SÓ após confirmação → OTO cai em checkout
   normal (sem cartão salvo — esperado)
D. Janela: esperar 60min → OTO recusa com 410 → manda pro preço cheio (147)
E. Bloqueio: conta sem kit → /kit mostra VENDA, não erro nem conteúdo
F. IA: falar com Coach → linha em dossiery_uso → do 2º turno cache_lido > 0
G. Pixel: Events Manager → Purchase conta 1x (dedup browser+CAPI funcionando)
