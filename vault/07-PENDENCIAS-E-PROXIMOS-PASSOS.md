# 07 · PENDÊNCIAS E PRÓXIMOS PASSOS (estado 12/08/2026)

## SITUAÇÃO CRÍTICA: dois deploys divergentes

dossiery.com.br está NO AR com versão MODIFICADA fora do GitHub (servidor
nginx próprio, subido pelo Enio/Leo). Diferenças verificadas:
- Checkout responde 401 "Entre ou crie sua conta" — mensagem que NÃO EXISTE
  no nosso código (guest checkout foi desativado por eles)
- Supabase não conectado: /api/dossiery/vagas → 503, /api/dossiery/lead →
  erro. O QUIZ NÃO SALVA NENHUM LEAD (topo do funil morto)
- Bundle TEM as parcelas novas (45/53/62), então partiu de commit recente,
  mas foi alterado depois
PRIMEIRA AÇÃO DE QUALQUER AGENTE: reconciliar. Perguntar ao Leo o que mudou
no servidor, incorporar o que fizer sentido, e religar o deploy ao GitHub
(branch claude/dossiery-conquista-platform-cirfjf). Enquanto não religar,
nada que se faça no repo chega ao ar.

## Os 20 itens do checklist de lançamento (resumo; detalhe em DOSSIERY-LANCAMENTO.md)

TRAVAM TUDO:
01 Vercel do repo desligada (402 DEPLOYMENT_DISABLED — billing)
02 Código não está na main (28+ commits só na branch)
03 Rodar as 7 migrações no Supabase
04 Rodar node scripts/setup-stripe.mjs (7 produtos, 17 preços)
CONFIGURAÇÃO:
05 Preencher as 30 envs (lista no arquivo 03)
06 Webhook Stripe com os 4 eventos (PIX incluso!)
07 Criar vercel.json com cron diário → /api/dossiery/renovacoes (NÃO EXISTE)
08 Ativar PIX + parcelamento na conta Stripe BR + CONFIRMAR custo real do
   parcelamento (2,5% é estimativa; se menor, parcelas caem pra 43/52/61)
09 DNS: app.dossiery.com.br não existe; dossiery.com.br está em parking
   Hostinger (nameservers dns-parking.com). Registrar: HSTDOMAINS/Hostinger,
   titular Matheus Cardoso, contato.cardosoeo@gmail.com, expira 16/05/2027
   (LIGAR RENOVAÇÃO AUTOMÁTICA). Não mexer no registro raiz, só criar CNAME.
LEGAL/INTEGRIDADE:
10 Termos/Privacidade com placeholders literais ([RAZÃO SOCIAL], [CNPJ],
   [ENDEREÇO], [E-MAIL], [CIDADE/UF], [DATA]) → preencher antes de vender
11 "Campo ilimitado" vendido no card do Recruta mas Campo é stub Fase 2 →
   tirar da copy ou construir (CDC art. 37)
12 Tela /conta é stub mas /api/dossiery/portal (billing Stripe) JÁ FUNCIONA
   e nenhuma tela aponta pra ela → construir Conta com portal + LGPD
   (exportar/apagar dados)
13 Prova social: recrutar 20 beta founders (playbook DOSSIERY-PROVA.md)
14 Provisionar 12% da receita pra garantia em dobro
15 Resolver call do Comandante (teto R$44,6k/mês) ANTES de escalar
VALIDAÇÃO:
16 Compra de teste ponta a ponta (roteiro A-G no arquivo 03) — NUNCA HOUVE
17 Verificar cache_lido > 0 no 2º turno (query no arquivo 04)
18 Validar dedup Pixel/CAPI no Events Manager
19 Decidir os 4 stubs restantes (esconder ou manter como roadmap)
20 Site Higgsfield (dossiery.higgsfield.app) é lista de espera funcional —
   pode captar leads desde já

## Melhorias que EU faria em seguida (backlog sugerido, não pedido)

- Ligar /dossiery/conta na API do portal que já existe (item 12)
- middleware.ts: liberar /api/dossiery/* e /dossiery/raio-x (bugs conhecidos)
- .env.example comentado no repo
- E-mail transacional (hoje não envia nada além do magiclink do Supabase)
- Separar o Dossiery do repo da clínica (produtos sem relação; deploy, envs
  e fatura amarrados). O dono ainda não decidiu.

## Referências no repo

DOSSIERY-LANCAMENTO.md (20 itens com checkbox) · DOSSIERY-ESTUDO-PRECIFICACAO.md
· DOSSIERY-PRECIFICACAO.md (decisões + queries) · DOSSIERY-PROVA.md ·
DOSSIERY-EMAILS.md · DOSSIERY-ADS.md · DOSSIERY-PESQUISA-FUNIS.md ·
DOSSIERY-ESTRATEGIA.md · DOSSIERY.md · Dossiery-Especificacao-do-Funil.pdf
(20 páginas, handoff pro programador) · docs-fonte-funil.html (fonte do PDF)
