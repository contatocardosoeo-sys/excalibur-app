# 02 · ARQUITETURA E CÓDIGO

## Stack

Next.js 16 (App Router, RSC, rotas dinâmicas force-dynamic onde precisa) ·
React 19 · TypeScript · Tailwind CSS 4 · Supabase (auth SSR + Postgres + RLS) ·
Stripe (Checkout + PaymentIntent off-session + webhooks) · Anthropic API
(claude-opus-5, fetch puro sem SDK) · Vercel (deploy alvo) · Meta Pixel + CAPI
server-side com event_id dedup · GA4.

## Estrutura de arquivos (branch claude/dossiery-conquista-platform-cirfjf)

app/dossiery/                    páginas públicas + funil
  page.tsx                       landing (383 linhas)
  raio-x/RaioXClient.tsx         quiz completo (554 linhas, client)
  precos/page.tsx                3 tiers + bump + resumo (295)
  oferta/{encontro,ultima,perfil,operador}/  as 4 OTOs
  entrando/page.tsx              ponte guest→sessão (CRÍTICA)
  (app)/                         área logada com sidebar
    base, coach, analisar, arsenal    módulos reais
    kit/KitView.tsx              entrega do Kit com copiar-1-toque
    {encontro,perfil,recomeco,plano7} entrega + telas bloqueadas de venda
    renovar/                     renovação D330
    components/DossierySidebar.tsx
    components/ModuloStub.tsx    template "Em construção"
  components/
    OfertaCliente.tsx            botão de compra 1-clique (contrato abaixo)
    PrazoOferta.tsx              countdown lendo prazo do servidor
    Provas.tsx                   prova social (rende NADA se lista vazia)
    VagasFundador.tsx            contador de vagas + hook useFaixa

app/api/dossiery/
  checkout/route.ts              cria Stripe Checkout (guest ok)
  upsell/route.ts                1-clique off-session OU checkout fallback
  coach/route.ts                 chat streaming (SSE → texto puro)
  analisar/route.ts              análise JSON (output schema)
  lead/route.ts                  salva lead do quiz
  vagas/route.ts                 contador público
  portal/route.ts                billing portal Stripe (SEM TELA apontando!)
  renovacoes/route.ts            cron D330 (SEM AGENDAMENTO!)
app/api/webhooks/stripe/route.ts liberação de acesso

app/lib/dossiery/
  stripe.ts        tipos Oferta/Tier, PRICE_ENV, janelas, colunaDaOferta
  fundador.ts      DEGRAUS [497/45, 597/53, 697/62], faixaAtual()
  claude.ts        cliente Anthropic + prompt caching + captura de Uso
  coachPrompt.ts   COACH_SYSTEM (~810 tokens) e ANALISAR_SYSTEM (~275)
  conta.ts         acharOuCriarUsuario, tokenDeEntrada (magiclink)
  capi.ts          Meta CAPI server-side
  janela.ts        prazo da OTO computado no servidor
  assinatura.ts    paywallAtivo(), temAssinaturaAtiva() (rejeita 'recruta' default)
  uso.ts           medição de IA + teto de uso justo (300/30d)
  raioX.ts         10 perguntas, 6 arquétipos (B/E/F/G/P/O), calcularResultado
  quizFx.ts        sons Web Audio sintetizados (zero assets) + vibração
  kitAberturas.ts, protocoloEncontro.ts, perfilMagnetico.ts,
  protocoloRecomeco.ts, plano7dias.ts     ← os 191 itens de conteúdo

middleware.ts      auth de DOIS produtos (clínica + dossiery) — ver nota abaixo
scripts/setup-stripe.mjs   cria 7 produtos + 17 preços (idempotente por lookup_key)
supabase/migrations/0001..0007

## Contratos de API (o que o front espera)

POST /api/dossiery/checkout  body {tier:'recruta'|'operador'|'comandante', bump:bool}
  → 200 {url}  (redirect pro Stripe)
  → 503 se STRIPE_SECRET_KEY ausente
  NUNCA aceita preço do cliente. Servidor escolhe degrau via faixaAtual().
  success_url = /dossiery/entrando?cs={CHECKOUT_SESSION_ID}&next={primeira OTO}
  Config Stripe: payment_method_types omitido (usa o que a conta tiver ativo);
  card: {setup_future_usage:'off_session', installments:{enabled:true}}

POST /api/dossiery/upsell  body {oferta: Oferta, next: string}
  → 200 {ok:true, id?, valor?}     cobrou no cartão salvo (fbq Purchase c/ eventID)
  → 200 {ok:true, ja_tinha:true}   já tinha o produto (não cobra, não trackeia)
  → 200 {url}                      sem cartão salvo → Checkout normal
  → 401 {entrar}                   sem sessão
  → 410 {destino}                  janela 60min expirou → manda pro preço cheio
  → 400/503                        oferta inválida / preço não configurado
  Ofertas válidas: kit, encontro_oto, encontro_down, encontro_app, plano7,
  perfil_oto, perfil_app, recomeco_oto, recomeco_app, operador_credito, renovacao
  operador_credito e renovacao são UPGRADE DE PLANO (mexem em plano/renova_em),
  o resto é entitlement (coluna booleana). ofertaEhUpgradeDePlano() decide.

POST /api/dossiery/coach  body {messages:[{role,content}...]}
  → stream texto puro (SSE parseado no servidor, só text_delta passa)
  → 401/402/429 (429 = teto de uso justo, mensagem convida pro suporte)
  Gate: DOSSIERY_GATE!=off exige login+assinatura. MAX 40 msgs, 8000 chars cada.

POST /api/dossiery/analisar  body {conversa, contexto?}
  → 200 {resultado: JSON}  (output_config json_schema, effort medium)
  → mesmos gates do coach

POST /api/dossiery/lead  body {email, whatsapp?, consent, score, arq}
  → salva em dossiery_leads. Consent obrigatório (LGPD).

## Integração Anthropic (claude.ts) — decisões

- fetch direto, sem SDK (runtime-agnóstico, edge-safe)
- Modelo: claude-opus-5 via coachModel() (env DOSSIERY_COACH_MODEL p/ trocar)
- thinking:{type:'adaptive'} + output_config.effort ('low' coach, 'medium' analisar)
- max_tokens 8000 (cobre thinking+texto)
- PROMPT CACHING (a correção de margem mais importante do projeto):
  2 marcadores cache_control ephemeral — no system (810 tok > piso 512 do Opus 5)
  e na última mensagem (o turno seguinte lê o prefixo todo do cache).
  Sem cache o custo era quadrático: 15 turnos = 73.800 tok de entrada para
  8.500 de conversa. Com cache: margem do Operador 6,9% → 69,5%.
  Raio-X NÃO tem cache: system 275 tok < piso 512, e cada análise é única.
- Uso capturado de message_start/message_delta no stream (flush ao fechar) e
  do usage no não-stream → registrarUso() grava em dossiery_uso. Fire-and-forget:
  medição quebrada nunca derruba resposta.

## Middleware (ATENÇÃO — 2 produtos no mesmo repo)

O repo abriga um SaaS de clínicas (produto original) + o Dossiery.
middleware.ts trata os dois: /dossiery/* tem lista própria de rotas públicas.
BUGS CONHECIDOS (corrigir):
1. /api/dossiery/* NÃO está nas rotas públicas → cai na regra da clínica e
   redireciona pra / sem login. Precisa liberar /api/dossiery.
2. /dossiery/raio-x não está em publicosDossiery → quiz (porta de entrada!)
   redireciona pro login. Adicionar.
DOSSIERY_GATE=off abre tudo (só preview; NUNCA produção).

## Quiz (RaioXClient.tsx) — o que tem de especial

- 10 cenários, 6 arquétipos: B(bombardeiro), E(esperador), F(fantasma),
  G(grudento), P(performático), O(operador). calcularResultado() soma pesos.
- Sons sintetizados via Web Audio (quizFx.ts): select/next/reveal/erro/lock.
  Zero arquivos de áudio. localStorage dossiery_som + navigator.vibrate.
- Bug de foco preso RESOLVIDO com trio: key={idx-i} por pergunta (remonta DOM),
  blur() no onPointerUp, hover só em @media (hover:hover) and (pointer:fine).
- Progresso salvo em localStorage dossiery_raiox (refresh não perde).
- Resultado borrado (blur CSS) antes do e-mail: existe de verdade, "lacrado".
- Teclado A-D/1-4, backspace volta. Rodapé mostra quanto falta.
- Captura: e-mail + WhatsApp opcional + consent checkbox 24px obrigatório.

## Pixel/CAPI

Browser: fbq InitiateCheckout no clique, Purchase com eventID no 1-clique ok.
Servidor: capi.ts manda Purchase com o MESMO event_id → Meta deduplica.
Validar no Events Manager que Purchase conta 1x, não 2x.
