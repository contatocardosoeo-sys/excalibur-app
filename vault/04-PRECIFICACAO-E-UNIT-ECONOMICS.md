# 04 · PRECIFICAÇÃO E UNIT ECONOMICS

Números da auditoria de 11/08/2026. Custos MEDIDOS no código; conversões são
PREMISSAS a substituir por dado real (a tabela dossiery_uso existe pra isso).

## COGS de IA (o maior custo do negócio)

Sessão de Coach 15 turnos, câmbio 5,11:
  Opus 5 SEM cache: 73.800 tok in → R$2,94  (custo quadrático no turno!)
  Opus 5 COM cache:  9.000 tok in → R$1,28
  (Sonnet 5 + cache seria R$0,51 — o dono DECIDIU ficar no Opus 5)
Análise do Raio-X: R$0,28 (Opus).

COGS/usuário/mês por perfil (com cache):
  Leve 4 sessões: R$2,50 · Médio 12: R$7,49 · Pesado 40: R$24,98 · P99 120: R$74,93
Mix presumido 60/30/10 → R$6,24/mês → R$75/ano por Operador.

## Margem por plano (líquido de taxa+imposto 11%+COGS 12m)

| Plano | Sem cache | Com cache |
|---|---|---|
| Recruta 97/mês | 51,4% | 78,2% |
| Operador 497 | 6,9% ⚠ | 69,5% |
| Comandante 1.297 | 54,9% | 78,8% |

Sensibilidade (a linha mais importante): base usando 2x o previsto →
sem cache = −70,8% (prejuízo!); com cache = 54,5%. O cache é o que separa
negócio escalável de negócio que quebra crescendo.

## Adquirência (premissas)

PIX 1,19% · cartão 3,99%+R$0,39 · parcelamento ~2,5% (NÃO confirmado na
fonte — Stripe bloqueada pela rede; confirmar com gerente. Se menor, parcelas
podem cair pra 43/52/61). Mix presumido 40% PIX / 60% cartão parcelado.
Imposto: Simples Anexo III ~11% (varia com faturamento/fator R).

## Funil por estágios (por 1.000 leads do quiz)

| Cenário | lead→tw | tw→core | R$/lead líquido | CPL máx @40% marg | CPA/tw |
|---|---|---|---|---|---|
| Pessimista | 3,0% | 6% | 2,54 | 1,53 | 50,88 |
| Realista | 5,5% | 10% | 6,18 | 3,71 | 67,44 |
| Otimista | 9,0% | 15% | 13,35 | 8,01 | 89,03 |

A CONTA QUE DECIDE: contribuição/lead − CPL. Realista só fecha com CPL < ~R$5
(empata em 6). Pessimista NÃO fecha em nenhum CPL. A alavanca não é verba, é
taxa de subida: 6%→15% tw→core multiplica contribuição por 5,3x.

## Investimento recomendado

Fase 0 (R$0): fechar os 20 itens de lançamento, prova social real, compra teste.
Fase 1 (R$3-5k em 14-21 dias): COMPRAR DADO, não lucro. R$200/dia devolve
~467 leads, ~26 tripwires, saldo ~−R$254 (aprendizado quase grátis se premissas
segurarem). Meta: CPL<R$5 e lead→tw>4%. Otimizar por COMPRA do tripwire.
Fase 2 (dobrar a cada 14d): só enquanto CPL real < contribuição real.
Parar de subir se ROAS < 1,3x.

Trajetória realista (CPL R$4): ROAS constante 1,54x —
3k/mês→lucro 1,6k · 12k→6,5k · 50k→27k/mês.
1,54x é FINO para DR (padrão quer 2-3x). Alta de 30% no CPL zera o lucro.
Operável, mas com acompanhamento semanal e renovação constante de criativo.

## Tetos que verba não move

1. Call do Comandante: 8h/semana = 34/mês = teto R$44,6 mil/mês. A projeção de
   50k/mês entrega 69 core/mês → BATE NO TETO. Resolver antes de escalar
   (vídeo assíncrono 15min, call em grupo, ou escassez explícita).
2. Escada de fundador: 500 vagas = R$308,5 mil bruto e ACABA. Esgotar custa
   ~R$364 mil de mídia — a escada NÃO é o negócio, é a mecânica de escassez;
   o negócio é tripwire+bump+OTOs no caminho. Decidir o pós-Vanguarda ANTES.
3. Garantia em dobro: custa 7-20% da receita conforme acionamento. Provisionar
   12%. Se acionamento >4%, trocar por "devolvo e você fica com os produtos".

## Risco não modelado

Conta de anúncio: nicho de conquista é sensível na Meta. Ter BM reserva ANTES
de escalar. Criativo longe de promessa de resultado com mulheres — usar o
posicionamento ético (treina o homem, não manipula) como vantagem.

## LTV (premissas)

Recruta churn 15%/mês → LTV líq R$505. Operador renovação 35% → R$549.
Anual à vista é a escolha certa pra tráfego pago (caixa antes de recomprar mídia).

## Queries de verificação (rodar após primeiras conversas reais)

-- cache pegando? (se cache_lido=0 no 2º turno, prefixo sendo invalidado)
select recurso, round(avg(cache_lido)) cache_medio,
round(100.0*sum(cache_lido)/nullif(sum(entrada+cache_lido+cache_escrito),0),1) pct
from dossiery_uso where criado_em > now()-interval '7 days' group by recurso;

-- custo real por usuário (substitui o mix presumido)
select user_id, count(*) chamadas,
round((sum(entrada+cache_escrito)/1e6*5 + sum(cache_lido)/1e6*0.5
 + sum(saida)/1e6*25)*5.11, 2) custo_brl
from dossiery_uso where criado_em > now()-interval '30 days'
group by user_id order by custo_brl desc limit 20;
