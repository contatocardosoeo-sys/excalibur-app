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

## Estado atual — Fase 0 (Fundação) ✅

- [x] Tema oxblood escopado (`.dossiery`) sem afetar a clínica
- [x] Layout de tema + shell do app + sidebar
- [x] Landing/manifesto
- [x] Todas as 10 telas navegáveis (base completa; demais com spec on-brand)
- [x] Middleware libera `/dossiery` para preview
- [x] Migration SQL completa + RLS

> **Preview aberto:** na Fase 0, `/dossiery/*` está público (sem gate de auth)
> para navegar a estética. O gate de auth + enforcement de RLS liga na fase de
> billing — ver middleware.ts e a coluna abaixo.

## Roadmap

- **Fase 1 — Núcleo de IA:** RAG v1 (ingestão do cânone + pgvector +
  classificador de ética), Coach, Analisar, Conta/perfil.
- **Fase 2 — Practice & Campo:** Arena com heat-map, Diário de Campo, CRM,
  cadência.
- **Fase 3 — Academia & Evolução:** biblioteca navegável, skill tree/XP,
  missões.
- **Fase 4 — Billing & Growth:** Stripe, planos, gate de auth/RLS ligado,
  painel LGPD, onboarding, analytics.
