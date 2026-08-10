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
| `STRIPE_PRICE_MENSAL` | price ID do Operador mensal (`price_…`) |
| `STRIPE_PRICE_ANUAL` | price ID do Operador anual (`price_…`) |
| `DOSSIERY_GATE` | `off` = tudo aberto (preview). **Remover no go-live.** |
| `DOSSIERY_PAYWALL` | `off` = login exigido mas IA liberada sem assinar. Padrão: on. |
| `NEXT_PUBLIC_META_PIXEL_ID` | ID do Pixel (Meta Events Manager). Sem ele, nenhum script carrega. |
| `NEXT_PUBLIC_GA4_ID` | ID do GA4 (`G-…`). Opcional. |

### Stripe — passo a passo (~5 min)

1. **Produto:** Dashboard → Product catalog → *Add product* → nome
   `Dossiery — Operador`.
2. **Preços:** no produto, crie 2 recurring prices em BRL:
   mensal `R$ 97,00` e anual `R$ 697,00`. Copie os dois `price_…` → envs.
3. **Webhook:** Developers → Webhooks → *Add endpoint* →
   URL `https://SEU-DOMINIO/api/webhooks/stripe` → eventos:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copie o `whsec_…` → env.
4. **Portal do cliente:** Settings → Billing → Customer portal → ativar
   (permitir cancelar/trocar cartão). O botão da conta usa `/api/dossiery/portal`.
5. **Reembolso (garantia 7 dias):** reembolsar direto no Dashboard do Stripe;
   o webhook `customer.subscription.deleted` corta o acesso sozinho.

> PIX: recorrência nativa no Stripe BR é cartão; PIX funciona bem para o plano
> anual via checkout (habilite PIX em Settings → Payment methods). Mensal = cartão.

### Supabase

1. Rodar `supabase/migrations/0001_dossiery_schema.sql` e
   `0002_dossiery_billing.sql` no SQL Editor (idempotentes).
2. Auth → Providers → Email: para funil sem fricção, **desligar** “Confirm
   email” (ou manter ligado — o fluxo de confirmação já é tratado no app).
3. Auth → URL Configuration: adicionar o domínio de produção em *Site URL* e
   *Redirect URLs* (`https://SEU-DOMINIO/api/auth/callback`).

### Tracking do funil (já instrumentado)

`PageView` em toda navegação · `InitiateCheckout`/`begin_checkout` no clique de
assinar (com valor) · `Purchase`/`purchase` em `/dossiery/bem-vindo` (valor por
ciclo + `eventID` = sessão de checkout p/ dedup). Basta preencher os dois envs.

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
