# ♠ DOSSIERY — Estratégia de Esteira & Escala Mundial

> Documento-mestre. Irmãos: [`DOSSIERY.md`](DOSSIERY.md) (runbook técnico),
> [`DOSSIERY-PESQUISA-FUNIS.md`](DOSSIERY-PESQUISA-FUNIS.md) (pesquisa de funis
> gringos), [`DOSSIERY-EMAILS.md`](DOSSIERY-EMAILS.md) (16 e-mails + 6 WhatsApp),
> [`DOSSIERY-ADS.md`](DOSSIERY-ADS.md) (12 ads + 3 UGC + guia de mídia).

---

## 1. A esteira completa (implementada em código)

| Degrau | Produto | Preço | Papel | Entrega |
|---|---|---|---|---|
| Isca | **Quiz Raio-X** (`/dossiery/raio-x`) | grátis | lead + segmentação por arquétipo | resultado na hora + e-mail |
| Tripwire | **Plano 7 Dias** | R$19 | transformar lead em COMPRADOR | `/dossiery/plano7` (40 passos) |
| Bump | **Kit 50 Aberturas** | R$37 | subir AOV no checkout | `/dossiery/kit` (50 msgs + porquê) |
| Core | **Operador** | R$97/mês · R$697/ano PIX | a máquina de MRR/caixa | app completo (Coach IA, Raio-X, Arena) |
| OTO 1 | **Protocolo Encontro** | R$97 (1-clique) | maximizar o pós-compra | `/dossiery/encontro` (34 jogadas) |
| Downsell | Encontro | R$47 (janela real 60min) | recuperar o "não" | idem |
| OTO 2 | **Perfil Magnético** | R$47 (1-clique) | segundo sim | `/dossiery/perfil` (37 ações) |
| Cross-sell | Kit R$37 · Encontro R$147 · Perfil R$67 · **Recomeço R$147** | in-app, eterno | monetizar a base pra sempre | `/dossiery/arsenal` |
| Ângulo novo | **Protocolo Recomeço** (reconquista ética) | R$147 | abre um SEGUNDO mercado de tráfego (dor: término) | `/dossiery/recomeco` (30 jogadas) |

**Compra máxima de um cliente: R$697+37+97+47+147 = R$1.025.**
Ticket médio realista (anual 40%, bump 40%, OTO1 15%, OTO2 12%): **R$330-420** vs CAC alvo R$165.

## 2. Os dois funis de entrada (teste A/B por campanha)

**Funil A — Direto (quente/morno):** Ad → `/dossiery` (página de vendas) → preços+bump → checkout → OTO1 → (downsell) → OTO2 → bem-vindo.

**Funil B — Quiz (frio, estilo Noom/BetterHelp):** Ad "descubra seu Modo" → `/dossiery/raio-x` (10 cenários, scoring real, arquétipo B/E/F/G/P) → gate de e-mail (LGPD, Lead + CAPI) → resultado com dor personalizada → preços **ou** tripwire R$19 → mesma cadeia de OTOs. Lead que não compra cai na sequência B de e-mails (5 toques).

Regra de mídia: cada campanha aponta pra UM funil — o pixel aprende separado; o CPA decide o vencedor por ângulo.

## 3. O que já está pronto EM CÓDIGO (hoje)

- Quiz gamificado com scoring honesto + 6 arquétipos + captura de lead (`dossiery_leads`)
- Upsell de 1 clique (cartão salvo off-session), fallback PIX, janela de 60min imposta no servidor
- 5 produtos com conteúdo COMPLETO e entrega no app (zero venda de fumaça)
- Arsenal (hub de cross-sell eterno), bem-vindo com ✓/🔒
- Meta CAPI server-side (Purchase/Lead com dedup por event_id) — crítico p/ iOS
- Pixels client (PageView, InitiateCheckout, Purchase, Lead, QuizStart)
- 16 e-mails + 6 WhatsApp prontos · 12 ads + 3 roteiros UGC + guia de mídia
- Setup Stripe em 1 comando (6 produtos, 11 preços, webhook)
- Segurança: RLS somente-leitura em assinaturas, paywall endurecido, escassez real

## 4. Backlog priorizado (da pesquisa de funis — o que AINDA não foi implementado)

| # | Tática (fonte) | Impacto | Esforço | Quando |
|---|---|---|---|---|
| 1 | ~~12x no anual~~ **FEITO em código** (installments no checkout; falta ativar o recurso no painel Stripe) | alto | feito | pronto |
| 1b | **Guest checkout** (só e-mail no Stripe; conta via webhook + magic link; OTO autentica pelo cs). Auditoria: conta antes do checkout custa 20-35% da conversão | alto | 2-4 dias | semana 1-2 |
| 2 | Upgrade mensal→anual em 1 clique (OTO p/ assinante mensal no D7) | alto | médio | semana 2 |
| 3 | Quiz longo 25-40 telas com projeção datada (Noom-style) — evoluir o Raio-X | alto | médio | após validar Funil B |
| 4 | Garantia condicional "cumpriu o Plano 7 Dias e nada? dobro o reembolso" | médio | baixo (copy+regra) | teste semana 3 |
| 5 | Challenge funnel "Desafio 7 Dias" ao vivo em grupo (R$47) | alto | médio | mês 2 |
| 6 | Streak + checklist diário + #wins (retenção estilo TRW, sem o tom) | alto (churn) | alto | mês 2-3 |
| 7 | Segundo bump no checkout (R$19,90) | médio | baixo | teste contínuo |
| 8 | Backend high-ticket por aplicação (mentoria grupo ~R$1.997) | alto (LTV) | alto | mês 3+, top 5% da base |
| 9 | Jornada de módulos com desbloqueio mensal (anti-churn Girls Chase) | médio | médio | mês 3 |
| 10 | Advertorial/carta longa como 3º funil de entrada | médio | baixo | teste mês 2 |

## 5. Roadmap de escala mundial (gates por métrica, não por ansiedade)

**Fase 0 — Validação BR (semanas 1-4):** R$150-300/dia. Gate: CPA ≤ R$165 sustentado 7 dias, reembolso < 10%, checkout→compra > 40%.
**Fase 1 — Escala BR (meses 2-4):** R$1-3k/dia, 10-20 criativos novos/semana (UGC é o teto de escala, não a verba), e-mail automation ligada, time: 1 editor de vídeo + 1 suporte. Gate: ROAS ≥ 1,5 no dia, LTV/CAC ≥ 3 em 60 dias.
**Fase 2 — LATAM/ES (meses 4-6):** produto já roda em ES com i18n leve (conteúdo dos produtos traduzido por IA + revisão nativa); México/Colômbia/Argentina via cartão local (dLocal/Stripe MX). CPM tão barato quanto BR.
**Fase 3 — EN global (meses 6-12):** mercado 10x maior, CPM 4-6x — só entrar com criativo validado + LTV BR provado; considerar preço US$ (pricing power 3-4x).

## 6. TUDO que falta (fora do código — o gargalo agora é execução de conta)

**Bloqueadores de lançamento (só o dono faz — ~1h):**
1. Stripe: rodar `scripts/setup-stripe.mjs` (test → live) + ativar PIX + (tática #1) criar o price parcelado 12x
2. Supabase: migrations 0001→0005 no SQL Editor + Auth URLs
3. Vercel: envs (Anthropic, Stripe ×9, Pixel, `META_CAPI_TOKEN`, GA4) + remover `DOSSIERY_GATE=off`
4. Domínio apontado + merge da branch pra produção
5. Dados legais (razão social/CNPJ, endereço, e-mail suporte) → preencher termos/privacidade
6. Meta: BM verificado, pixel criado, conta de anúncios com limite saudável, página+IG do Dossiery
7. Compra-teste ponta a ponta (cartão e PIX de teste): checkout → OTO1 → OTO2 → arsenal liberado

**Para escalar de verdade (semanas 1-8):**
8. E-mail: conta Resend/Brevo + colar as 16 sequências + domínio de envio (SPF/DKIM)
9. WhatsApp Business para os 6 scripts de recuperação (manual no começo)
10. Criativos em volume: gravar os 3 roteiros UGC (1 ator ou você) — sem UGC não há Fase 1
11. Prova social real: primeiros 10-20 depoimentos autorizados (os e-mails A3/B3 têm placeholders esperando casos reais)
12. Dashboard de métricas diárias (CPA/AOV/reembolso por funil) — planilha resolve no início
13. Suporte: caixa dedicada + SLA de reembolso em 24h (protege a conta Meta)
14. Contingência de mídia: 2ª BM + 2ª conta de anúncios aquecida (contas caem; quem escala tem reserva)
15. Jurídico: revisão dos termos por advogado + CNPJ com CNAE certo + contador (imposto de infoproduto/SaaS)

> **Resumo brutal:** o produto, o funil, o conteúdo, os e-mails e os anúncios EXISTEM.
> Entre você e o primeiro real: itens 1-7 (~1h de contas e senhas).
> Entre o primeiro real e a escala: criativo em volume (10) + prova social (11) + processo (12-15).
