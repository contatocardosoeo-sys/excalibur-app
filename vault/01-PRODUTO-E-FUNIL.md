# 01 · PRODUTO E FUNIL — especificação completa

## Os 7 produtos (o que cada um entrega)

| Produto | Conteúdo | Itens |
|---|---|---|
| Operador (plano) | Acesso ao app: Coach IA, Raio-X de conversas, Base | — |
| Comandante (plano) | Tudo do Operador + arsenal inteiro + 1 call de 45min | — |
| Kit 50 Aberturas | Primeiras mensagens por situação, cada uma com o porquê | 50 |
| Protocolo Encontro | Da chegada ao segundo encontro (34 jogadas em 7 fases) | 34 |
| Perfil Magnético | Ações para o perfil nos apps de namoro | 37 |
| Protocolo Recomeço | Reconstrução pós-término | 30 |
| Plano 7 Dias | Bootcamp: 7 missões, 1 por dia, <30min cada | 40 |

## Os 17 preços (lookup_key → valor → onde aparece)

| lookup_key | Valor | Tipo | Contexto |
|---|---|---|---|
| dossiery_plano7 | R$19 | único | Tripwire pós-quiz |
| dossiery_bump | R$37 | único | Order bump na /precos (pré-marcado) |
| dossiery_encontro_down | R$47 | único | Downsell da OTO1 |
| dossiery_perfil_oto | R$47 | único | OTO2 |
| dossiery_perfil_app | R$67 | único | Preço cheio no app |
| dossiery_mensal | R$97/mês | ASSINATURA | Plano Recruta (único recorrente!) |
| dossiery_encontro_oto | R$97 | único | OTO1, janela 60min |
| dossiery_recomeco_oto | R$97 | único | Oferta do Recomeço |
| dossiery_encontro_app | R$147 | único | Preço cheio no app |
| dossiery_recomeco_app | R$147 | único | Preço cheio no app |
| dossiery_operador_credito | R$478 | único | OTO pós-tripwire (497−19) |
| dossiery_anual_t1 | R$497 | único | Degrau Fundador (100 vagas) 12x R$45 |
| dossiery_anual_t2 | R$597 | único | Degrau Pioneiro (200 vagas) 12x R$53 |
| dossiery_renovacao | R$597 | único | Renovação D330 |
| dossiery_anual_t3 | R$697 | único | Degrau Vanguarda (200 vagas) 12x R$62 |
| dossiery_anual | R$697 | único | Anual padrão sem degrau |
| dossiery_comandante | R$1.297 | único | Plano topo |

REGRA: só o mensal é assinatura. O anual é pagamento único com validade em
renova_em no banco — evita cobrança surpresa e melhora caixa para tráfego pago.

PARCELAS: 45/53/62 não são preço/12. Foram calculadas para o líquido do
parcelado empatar com o do PIX (taxa cartão 3,99%+R$0,39 + ~2,5% parcelamento).
As antigas (42/50/58) perdiam ~R$21/venda; na Vanguarda o parcelado saía mais
barato que o PIX.

## O que cada compra libera (webhook → banco)

| Compra | Grava |
|---|---|
| Bump/Kit | kit_aberturas=true |
| Encontro (qualquer preço) | protocolo_encontro=true |
| Perfil (qualquer preço) | perfil_magnetico=true |
| Recomeço (qualquer preço) | recomeco=true |
| Plano 7 Dias | plano_7d=true |
| Recruta/Operador | plano='operador' + tier real ('recruta'/'operador') |
| Comandante | plano + tier + OS 5 ENTITLEMENTS DE UMA VEZ |

Entitlements são vitalícios e irreversíveis (nunca voltam a false).

## Mapa do funil — Entrada 1: quiz

/dossiery (landing) → /dossiery/raio-x (quiz 10 cenários)
→ captura: e-mail obrigatório + WhatsApp opcional + consent LGPD obrigatório
→ resultado na tela (score borrado ANTES do e-mail: real, mas "lacrado")
→ oferta tripwire R$19 (Plano 7 Dias)
→ comprou → /dossiery/entrando → OTO /dossiery/oferta/operador R$478
→ aceitou → /dossiery/base | recusou → /dossiery/plano7

## Mapa do funil — Entrada 2: preços

/dossiery/precos (3 tiers + bump pré-marcado + resumo do pedido)
→ checkout Stripe (cartão 12x ou PIX; guest ok)
→ /dossiery/entrando?cs=...&next=... (cria conta, abre sessão, redireciona)
→ OTO1 /dossiery/oferta/encontro R$97 [janela 60min, countdown real]
   aceitou → OTO2 | recusou → downsell
→ DOWNSELL /dossiery/oferta/ultima R$47 (mesmo produto, sem cortes)
   aceitou ou recusou → OTO2
→ OTO2 /dossiery/oferta/perfil R$47
   aceitou ou recusou → /dossiery/bem-vindo → /dossiery/base

## Cross-sell eterno no app

Quem não comprou nas OTOs vê os produtos bloqueados no app PELO PREÇO CHEIO:
Encontro R$147, Perfil R$67, Recomeço R$147. A página bloqueada é página de
venda, nunca erro. A diferença OTO→app é o que torna a urgência honesta.

## Renovação (D330)

Anual expira em renova_em (12 meses). Rotina diária /api/dossiery/renovacoes
(protegida por DOSSIERY_CRON_SECRET) acha quem está a 35 dias do fim
(JANELA_RENOVACAO_DIAS=35) e oferece renovação por R$597 em /dossiery/renovar.
PENDENTE: não existe vercel.json com o cron — nada chama a rotina hoje.

## As 30 rotas (5 grupos)

VENDA: /dossiery, /raio-x, /precos, /garantia, /termos, /privacidade
CONTA/PONTE: /criar-conta, /entrar, /entrando (crítica!), /bem-vindo
OTO: /oferta/encontro, /oferta/ultima, /oferta/perfil, /oferta/operador
APP (10 módulos): base✓, coach✓, analisar✓, arsenal✓ | arena, conexoes,
  campo, academia, evolucao, conta = STUBS "Em construção" honestos
CONTEÚDO: /kit, /encontro, /perfil, /recomeco, /plano7, /renovar

ATENÇÃO: /precos vende "Campo ilimitado" no card do Recruta mas Campo é stub
Fase 2 → risco CDC art.37, decidir antes de vender (tirar da copy ou construir).

## Regras de negócio críticas

1. JANELA DE 60min: JANELA_OFERTA_MS = 60*60*1000 desde a compra. O servidor
   RECUSA (HTTP 410) depois disso e manda o destino de preço cheio. O countdown
   na tela lê o MESMO prazo do servidor (janela.ts). Escassez real.
2. DEGRAUS: preço anual escolhido PELO SERVIDOR contando vendas no banco
   (faixaAtual(vendidos) em fundador.ts). Cliente nunca envia preço.
3. VAGAS: contador lido de /api/dossiery/vagas (banco real).
4. GARANTIA: dupla — em dobro condicionada às 7 missões cumpridas + CDC 7 dias
   incondicional. São coisas separadas, a página explica as duas.
5. GUEST CHECKOUT: comprar não exige conta. A conta nasce no webhook
   (acharOuCriarUsuario) e /entrando abre a sessão via verifyOtp de magiclink.
6. 1-CLIQUE: setup_future_usage:'off_session' no cartão → OTOs cobram via
   PaymentIntent off-session sem novo checkout. PIX não salva cartão → OTO
   cai em Checkout normal (fallback automático).
