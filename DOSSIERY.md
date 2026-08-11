# ♠ Dossiery — Projeto Conquista

> Coach de conquista com IA. **Treina o homem, não engana a mulher.**
> Vende competência, não dependência.

Produto separado, construído **dentro deste repo** como um namespace próprio em
`/dossiery/*`, com identidade visual (oxblood/obsidiana) escopada na classe
`.dossiery` — sem tocar no tema âmbar do excalibur-app (clínica).

---

## Posicionamento (a tese)

A categoria "rizz app" é grande e provada (o líder, Rizz: ~7,5M downloads,
~$500K/mês, bootstrapped), mas todos vendem a mesma coisa: **o app fala por
você** → frases robóticas, o "ick", "chatfishing" e o cara que trava no
encontro sem a muleta. O único resultado que um clone de GPT não copia é **o
homem ficar genuinamente melhor**. Até o Hinge foi pra esse lado (coaching que
deliberadamente não gera script pronto). É essa a brecha — e o fosso.

## Carta de princípios (= arquitetura, não rodapé)

**Faz:** coacha você (confiança, calibração, escuta, presença); analisa as
_suas_ conversas; ensina a ler interesse **e** desinteresse; trata rejeição
como informação.
**Nunca faz:** vigilância/dossiê de exploração; responder no automático se
passando por você; tática pra "vencer um não"; negging/love-bombing/PUA.
No motor, isso vira um **classificador de ética** que roda antes do retrieval
do RAG (bloqueia manipulação, injeta o princípio, redireciona pra auto-trabalho).

---

## Arquitetura

- **Stack:** Next 16 (App Router, RSC) · React 19 · Tailwind 4 · Supabase (SSR
  auth, Postgres+RLS, pgvector, Realtime, Storage) · IA Claude + RAG.
- **Rotas:** tudo sob `/dossiery/*`.
  - `app/dossiery/layout.tsx` — aplica o tema `.dossiery` (landing + app).
  - `app/dossiery/page.tsx` — landing pública.
  - `app/dossiery/(app)/*` — o app autenticado, com sidebar própria.
- **Tema:** tokens oxblood/obsidiana em `app/globals.css`, escopados em
  `.dossiery` (utilitários `.font-serif-d`, `.font-mono-d`, `.d-grid-bg`).

### Mapa de telas

| Rota | Papel |
|------|-------|
| `/dossiery` | Landing / manifesto |
| `/dossiery/base` | Command center (missão do dia, evolução, insight, atalhos) |
| `/dossiery/coach` | IA-coach (RAG + perfil), streaming, cita o cânone |
| `/dossiery/analisar` | Raio-X da conversa → diagnóstico + respostas na sua voz |
| `/dossiery/arena` | Roleplay com feedback por mensagem + heat-map |
| `/dossiery/conexoes` | CRM pessoal (suas notas, RLS por usuário) |
| `/dossiery/campo` | Diário de campo → debrief da IA |
| `/dossiery/academia` | Biblioteca do cânone (trilhas, princípios, drills) |
| `/dossiery/evolucao` | Skill tree / XP / streaks |
| `/dossiery/conta` | Perfil do atleta, plano, privacidade (LGPD) |

---

## Banco de dados

Migration: [`supabase/migrations/0001_dossiery_schema.sql`](supabase/migrations/0001_dossiery_schema.sql)

- Isolamento **por usuário**: toda tabela tem `user_id → auth.users` com RLS
  `user_id = auth.uid()`.
- Cânone do RAG (`dossiery_kb_*`) é compartilhado: leitura para autenticados,
  escrita só via `service_role`. `dossiery_kb_chunks.embedding vector(1536)`
  com índice HNSW (cosine).

**Rodar:** cole o arquivo no SQL Editor do Supabase (requer extensão `vector`,
disponível no Supabase). Idempotente.

---

## Estado atual — rumo ao LANÇAMENTO 🚀

- [x] **S0 · Fundação** — tema oxblood, shell, landing, 10 telas, migration+RLS
- [x] **S1 · Núcleo de IA** — Coach (streaming) e Analisar (saída estruturada)
      funcionando com o cânone destilado + guardrails (RAG pgvector fica p/ v2)
- [x] **S2 · Máquina de dinheiro** — Stripe (checkout + portal + webhook),
      auth própria (`/dossiery/entrar`, `/criar-conta`), página de preços,
      gate de acesso no middleware e enforcement de assinatura nas rotas de IA
- [ ] **S3 · Página de vendas + onboarding** (oferta forte, 1º "aha")
- [ ] **S4 · Go-live** — domínio, termos/privacidade, pixel, teste de compra real

## Runbook de lançamento (checklist de env/config)

### Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Var | O quê |
|---|---|
| `ANTHROPIC_API_KEY` | chave da API Claude (console.anthropic.com) |
| `DOSSIERY_COACH_MODEL` | opcional; padrão `claude-opus-5` (use `claude-sonnet-5` p/ baratear) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | criado no passo Webhook abaixo (`whsec_…`) |
| `STRIPE_PRICE_MENSAL` | price **recorrente/mês** do Operador (`price_…`) |
| `STRIPE_PRICE_ANUAL` | price **único (one-time)** R$697 do Operador (`price_…`) |
| `STRIPE_PRICE_BUMP` | price **único** R$37 do order bump / kit no app (opcional; sem ele o bump some) |
| `STRIPE_PRICE_ENCONTRO_OTO` | price único R$97 — upsell pós-compra (janela 60min) |
| `STRIPE_PRICE_ENCONTRO_DOWN` | price único R$47 — downsell (mesma janela) |
| `STRIPE_PRICE_ENCONTRO_APP` | price único R$147 — Protocolo Encontro dentro do app |
| `STRIPE_PRICE_PLANO7` | price único R$19 — tripwire do quiz |
| `STRIPE_PRICE_PERFIL_OTO` | price único R$47 — Perfil Magnético na OTO2 (janela 60min) |
| `STRIPE_PRICE_PERFIL_APP` | price único R$67 — Perfil Magnético no app |
| `STRIPE_PRICE_RECOMECO_OTO` | price único R$97 — Recomeço em oferta (janela 60min) |
| `STRIPE_PRICE_RECOMECO_APP` | price único R$147 — Recomeço no app |
| `META_CAPI_TOKEN` | token da Conversions API (Events Manager → Configurações). Liga o tracking server-side. |
| `DOSSIERY_GATE` | `off` = tudo aberto (preview). **Remover no go-live.** |
| `DOSSIERY_PAYWALL` | `off` = login exigido mas IA liberada sem assinar. Padrão: on. |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID do Pixel (Meta Events Manager). Sem ele, nenhum script carrega. |
| `NEXT_PUBLIC_GA4_ID` | ID do GA4 (`G-…`). Opcional. |

### Stripe — em 1 comando (recomendado)

Cria produtos, os 3 preços e o webhook de uma vez, sem clicar no painel.
A chave nunca sai da sua máquina:

```sh
# 1) TESTE primeiro (valide a compra antes de gastar em anúncio)
STRIPE_SECRET_KEY=sk_test_xxx \
  node scripts/setup-stripe.mjs https://SEU-DOMINIO/api/webhooks/stripe

# 2) depois de validar, rode de novo com a chave LIVE p/ criar em produção
STRIPE_SECRET_KEY=sk_live_xxx \
  node scripts/setup-stripe.mjs https://SEU-DOMINIO/api/webhooks/stripe
```

O script imprime os `price_…` e o `whsec_…` prontos pra colar nas envs. Depois
só falta **ativar o PIX** (Settings → Payment methods → Pix) — isso é clique no
painel. Se preferir fazer tudo manual, o passo a passo abaixo cobre o mesmo.

### Stripe — passo a passo manual (~5 min)

1. **Produto:** Dashboard → Product catalog → *Add product* → `Dossiery — Operador`.
2. **Preços** (BRL), no produto:
   - Mensal: **recurring** `R$ 97,00/mês` → `STRIPE_PRICE_MENSAL`
   - Anual: **one-time** (pagamento único) `R$ 697,00` → `STRIPE_PRICE_ANUAL`
     *(pagamento único de propósito: PIX à vista, zero recusa de cartão, caixa
     no dia 1; concede 12 meses de acesso; renovação por nova compra/e-mail).*
3. **Order bump** (outro produto): `Kit 50 Aberturas` → price **one-time**
   `R$ 37,00` → `STRIPE_PRICE_BUMP`.
4. **PIX:** Settings → Payment methods → ativar **Pix** (aparece no checkout do
   anual, que é `mode=payment`). O código omite `payment_method_types` de
   propósito p/ o Stripe surfar cartão + PIX conforme o painel.
5. **Webhook:** Developers → Webhooks → *Add endpoint* →
   `https://SEU-DOMINIO/api/webhooks/stripe` → eventos:
   `checkout.session.completed`, **`checkout.session.async_payment_succeeded`**
   (PIX cai async!), `customer.subscription.updated`,
   `customer.subscription.deleted`. Copie o `whsec_…` → env.
6. **Portal do cliente:** Settings → Billing → Customer portal → ativar
   (cancelar/trocar cartão — só afeta o mensal). Botão em `/api/dossiery/portal`.
7. **Reembolso (garantia 7 dias):** mensal → reembolsar no Dashboard (o webhook
   `subscription.deleted` corta o acesso). Anual one-time → reembolsar o
   pagamento e ajustar `dossiery_assinaturas.status='cancelado'` (ou zerar
   `renova_em`) manualmente, já que não há assinatura a cancelar.

> **Como o acesso é liberado:** cartão → na hora (`checkout.session.completed`
> com `payment_status=paid`). PIX → quando o cliente paga o QR
> (`async_payment_succeeded`). Anual one-time grava `renova_em = hoje + 12
> meses`; o gate (`temAssinaturaAtiva`) exige `status=ativo` **e** `renova_em`
> no futuro. **Teste os dois no test mode** (cartão `4242…` e o fluxo PIX de
> teste) antes do tráfego.

### Supabase

1. Rodar as migrations no SQL Editor, em ordem (todas idempotentes):
   `0001_dossiery_schema.sql` → `0002_dossiery_billing.sql` →
   `0003_dossiery_kit.sql` (coluna `kit_aberturas`) →
   `0004_dossiery_funil.sql` (coluna `protocolo_encontro` + **RLS: assinaturas
   viram somente-leitura pro usuário** — correção de segurança, não pule) →
   `0005_dossiery_esteira.sql` (leads do quiz + colunas `plano_7d`,
   `perfil_magnetico`, `recomeco`).
2. Auth → Providers → Email: para funil sem fricção, **desligar** “Confirm
   email” (ou manter ligado — o fluxo de confirmação já é tratado no app).
3. Auth → URL Configuration: adicionar o domínio de produção em *Site URL* e
   *Redirect URLs* (`https://SEU-DOMINIO/api/auth/callback`).

### O funil completo (mapa)

```
ENTRADA A (direto)                    ENTRADA B (quiz gamificado)
/dossiery ────────────┐               /dossiery/raio-x → arquétipo + LEAD
                      ▼                        │ (e-mail capturado, seq. B)
             /dossiery/precos  ◄───────────────┤
             [BUMP ✓: Kit R$37]                └→ tripwire /dossiery/plano7 (R$19)
                      ▼
             Stripe Checkout (anual R$697 PIX · mensal R$97)
                      ▼
             OTO1 /dossiery/oferta/encontro   [1-CLIQUE R$97]
               recusou → /oferta/ultima       [DOWNSELL R$47 · janela real 60min]
                      ▼
             OTO2 /dossiery/oferta/perfil     [1-CLIQUE R$47]
                      ▼
             /dossiery/bem-vindo (✓/🔒) → /dossiery/arsenal
             CROSS-SELL eterno: Kit R$37 · Encontro R$147 · Perfil R$67
                                Recomeço R$147 · Plano7 R$19
```

Esteira, backlog e roadmap de escala: [`DOSSIERY-ESTRATEGIA.md`](DOSSIERY-ESTRATEGIA.md).
Assets: [`DOSSIERY-EMAILS.md`](DOSSIERY-EMAILS.md) · [`DOSSIERY-ADS.md`](DOSSIERY-ADS.md) ·
[`DOSSIERY-PESQUISA-FUNIS.md`](DOSSIERY-PESQUISA-FUNIS.md).

- **1 clique de verdade:** o checkout principal salva o cartão
  (`setup_future_usage`, só p/ cartão); o upsell cobra off-session sem
  redigitar. Comprou no PIX? O upsell abre outro QR. Cartão recusou? Cai pro
  checkout normal — a venda nunca morre.
- **Janela de 60min é real:** `/api/dossiery/upsell` recusa (410) o preço de
  funil depois de 60min da ativação. Escassez que sobrevive a Procon/Meta.
- **Entrega existe:** Kit (50 aberturas) e Protocolo (34 jogadas) são páginas
  de conteúdo completas — zero risco de reembolso por "produto vazio".
- **AOV alvo:** 697 + 37 (bump ~40%) + 97 (OTO ~15%) ⇒ ~R$740 no melhor caso;
  média realista ~R$300+ vs CAC ~R$165 → ROI dia 1.

### Tracking do funil (já instrumentado)

`PageView` em toda navegação · `InitiateCheckout`/`begin_checkout` no clique de
assinar e nos botões de oferta (com valor) · `Purchase`/`purchase` dispara na
**OTO** (primeira tela pós-checkout; `eventID` = sessão de checkout p/ dedup —
visitar /bem-vindo direto não dispara nada) · upsell 1-clique dispara Purchase
próprio com `eventID` = payment intent. Basta preencher os dois envs.

### Checklist final antes do tráfego frio

1. Preencher os `[CAMPOS]` de `/dossiery/termos` e `/dossiery/privacidade`
   (razão social, CNPJ, e-mails, foro, data) e revisar com advogado.
2. Rodar **compra-teste** no Stripe test mode: cartão `4242 4242 4242 4242`,
   qualquer validade futura/CVC → conferir: redirect pro `bem-vindo`, status
   `ativo` em `dossiery_assinaturas`, acesso ao Coach liberado, cancelamento
   pelo portal derrubando o acesso.
3. Trocar chaves test → live no Stripe e refazer 1 compra real (pode
   reembolsar em seguida).
4. Conferir eventos no Meta Events Manager (Test Events) durante a compra-teste.
5. Anúncios: enquadrar como autodesenvolvimento; nada de atributo pessoal na
   copy ("você não consegue…" = rejeição), nada de antes/depois. Criativos e
   copys prontos entregues no kit (ver conversa do projeto).

### Fluxo do funil (como funciona)

`/dossiery` (landing) → `/dossiery/precos` → cria conta → Stripe Checkout →
webhook grava `dossiery_assinaturas.status='ativo'` → `/dossiery/bem-vindo` →
app liberado. Sem assinatura: telas respondem 402 com CTA pro preço.
Cancelou/reembolsou: webhook derruba o status e o acesso trava sozinho.

## Roadmap pós-lançamento

- **v2 — RAG completo:** ingestão do cânone + pgvector + classificador de
  ética como camada própria.
- **Practice & Campo:** Arena com heat-map, Diário de Campo, CRM, cadência.
- **Academia & Evolução:** biblioteca navegável, skill tree/XP, missões.
- **Growth:** onboarding guiado, e-mails de ciclo de vida, analytics/pixel.
