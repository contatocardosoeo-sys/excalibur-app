# Variaveis de Ambiente — excalibur-app

**Indice, nao cofre.** Aqui so o nome, o que faz e onde vive o valor.
Valor real fica no painel de variaveis do ambiente de deploy ou no
gerenciador de senhas. Nunca neste arquivo.

31 variaveis usadas no codigo. Levantadas por varredura de `process.env`
em `app/`, `middleware.ts` e `scripts/` em 17/08/2026.

## Infraestrutura

> **ATENCAO — vale so pra linhagem do GitHub.** Producao NAO usa Supabase.
> Roda PostgreSQL local no container `dossiery-postgres`, com migracoes
> Drizzle na inicializacao. Confirmado por Enio em 17/08/2026. As variaveis
> de Supabase abaixo existem no codigo desta branch, nao no ambiente de
> producao. Ver `.brain/excaliburgit.md`, secao de decisao pendente.

| Variavel | Uso | Obrigatoria |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | So na linhagem GitHub |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publica, client-side com RLS | So na linhagem GitHub |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave admin, so server-side, bypassa RLS | So na linhagem GitHub |
| `NEXT_PUBLIC_APP_URL` | Origem usada em `success_url` e `cancel_url` do Stripe | Sim, nas duas |

Projeto Supabase: `hluhlsnodndpskrkbjuw`. Compartilhado com o ExcaliburHQ.

> **Divida tecnica**: `middleware.ts` tem a URL do Supabase chumbada como
> fallback. Se a variavel faltar, o app nao quebra — conecta calado no
> projeto do fallback. Mascara erro de configuracao. Remover quando o
> ambiente estiver estavel.

## Stripe

| Variavel | Uso |
|---|---|
| `STRIPE_SECRET_KEY` | Chave secreta da conta |
| `STRIPE_WEBHOOK_SECRET` | Assinatura do webhook em `/api/webhooks/stripe` |

### Precos — 17 IDs, 7 produtos

Criados pelo `scripts/setup-stripe.mjs`, que e idempotente (usa `lookup_key`).
Rodar o script preenche todos de uma vez.

| Variavel | Produto |
|---|---|
| `STRIPE_PRICE_MENSAL` | Recruta, assinatura mensal |
| `STRIPE_PRICE_ANUAL` | Operador, plano base |
| `STRIPE_PRICE_ANUAL_T1` | Operador, tier Fundador |
| `STRIPE_PRICE_ANUAL_T2` | Operador, tier Pioneiro |
| `STRIPE_PRICE_ANUAL_T3` | Operador, tier Vanguarda |
| `STRIPE_PRICE_OPERADOR_CREDITO` | Operador parcelado em 12x |
| `STRIPE_PRICE_COMANDANTE` | Comandante, tier de topo |
| `STRIPE_PRICE_BUMP` | Order bump: Kit 50 Aberturas |
| `STRIPE_PRICE_PLANO7` | Tripwire R$19 |
| `STRIPE_PRICE_ENCONTRO_OTO` | OTO do Encontro |
| `STRIPE_PRICE_ENCONTRO_DOWN` | Downsell do Encontro |
| `STRIPE_PRICE_ENCONTRO_APP` | Encontro, venda dentro do app |
| `STRIPE_PRICE_PERFIL_OTO` | OTO do Perfil |
| `STRIPE_PRICE_PERFIL_APP` | Perfil, venda dentro do app |
| `STRIPE_PRICE_RECOMECO_OTO` | OTO do Recomeco |
| `STRIPE_PRICE_RECOMECO_APP` | Recomeco, venda dentro do app |
| `STRIPE_PRICE_RENOVACAO` | Renovacao anual, cobranca em D-330 |

## IA

| Variavel | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Coach e Analisar |
| `DOSSIERY_COACH_MODEL` | Override do modelo. Sem ela, usa o padrao do codigo |

Prompt caching esta ligado no Coach. Sem ele a margem do Operador cai de
~69% para ~7%. Nao desligar sem refazer a conta em
`DOSSIERY-ESTUDO-PRECIFICACAO.md`.

## Marketing

| Variavel | Uso |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Pixel do Meta, client-side |
| `META_CAPI_TOKEN` | API de Conversoes, server-side |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 |

## Operacao

| Variavel | Uso |
|---|---|
| `DOSSIERY_CRON_SECRET` | Autentica o cron em `/api/dossiery/renovacoes` |

## PERIGO — nunca em producao

| Variavel | Efeito se vazar pra prod |
|---|---|
| `DOSSIERY_GATE=off` | Desliga login e paywall do produto inteiro |
| `DOSSIERY_PAYWALL=off` | Libera todo o conteudo pago de graca |

As duas existem so pra preview e desenvolvimento. Conferir que NAO estao
setadas antes de qualquer deploy de producao.

Estado em 17/08/2026, verificado por Enio no servidor: `DOSSIERY_GATE=on` e
`DOSSIERY_PAYWALL=on`. Seguras.

## Estado do Stripe em producao

Verificado por Enio em 17/08/2026:

- Ambiente: **test**
- 17 precos configurados, validos e ativos
- Webhook habilitado em `https://dossiery.com.br/api/webhooks/stripe`, com os
  eventos necessarios cadastrados
- Parcelamento habilitado no codigo
- **PIX desligado** na configuracao do Stripe
- **`charges_enabled=false`** — a conta ainda nao aceita cobranca real
- Titularidade e CNPJ a conferir no painel

`charges_enabled=false` e bloqueio duro de go-live: sem isso a conta nao
processa pagamento nenhum em modo live, independente de codigo.
