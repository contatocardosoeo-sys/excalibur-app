# Dossiery · decisões de precificação

Registro do que foi decidido no estudo de precificação e o que mudou no código.
Data: 11/08/2026. Revisar quando houver dado real de consumo.

---

## Tabela de preços (fechada)

| Item | Preço | Observação |
|---|---|---|
| Plano 7 Dias (tripwire) | R$ 19 | Qualifica comprador |
| Kit 50 Aberturas (bump) | R$ 37 | Vitalício, incluso no Comandante |
| Protocolo Encontro · OTO | R$ 97 | Janela de 60 min |
| Protocolo Encontro · downsell | R$ 47 | Janela de 60 min |
| Protocolo Encontro · no app | R$ 147 | Âncora real |
| Perfil Magnético · OTO2 | R$ 47 | |
| Protocolo Recomeço · OTO | R$ 97 | R$ 147 no app |
| Recruta | R$ 97/mês | Isca de comparação |
| Operador · Fundador | R$ 497 (12x R$ 45) | 100 vagas |
| Operador · Pioneiro | R$ 597 (12x R$ 53) | 200 vagas |
| Operador · Vanguarda | R$ 697 (12x R$ 62) | 200 vagas |
| Comandante | R$ 1.297 | Pagamento único |
| Renovação | R$ 597 | D330 |

### Por que as parcelas subiram

As parcelas antigas (42 / 50 / 58) não cobriam nem a taxa de cartão, quanto mais
o custo de parcelamento. Na Vanguarda o parcelado saía **mais barato que o PIX**
(12x 58 = R$ 696 contra R$ 697 à vista).

Mesmo com custo de parcelamento zero, a taxa de cartão sozinha (3,99% + R$ 0,39)
já não cabia no markup. Os valores novos empatam o líquido do parcelado com o do
PIX, presumindo 2,5% de custo de parcelamento.

> **Pendência:** o domínio da Stripe está bloqueado pelo proxy da rede, então
> esse 2,5% não foi confirmado na fonte. Confirme com o gerente de conta. Se o
> custo real for menor, dá para baixar para 43 / 52 / 61.

### Order bump

Fica **pré-marcado**. A manchete do card do Operador mostra o preço do plano
(o mesmo anunciado na landing) e o bump aparece só no resumo do pedido e no
botão, como em qualquer carrinho. Assim nenhum número novo aparece no checkout.

Para desmarcar por padrão: `useState(false)` na linha 13 de
`app/dossiery/precos/page.tsx`.

---

## Custo de entrega

O maior custo do negócio é a API da Anthropic, não infraestrutura.

**Modelo:** mantido em `claude-opus-5`. Trocar de modelo é decisão de produto,
não de engenharia, e o Coach é o núcleo da entrega. A variável
`DOSSIERY_COACH_MODEL` existe em `claude.ts:12` se você quiser calibrar depois,
com dado real na mão.

**Prompt caching** (`claude.ts`): ligado no Coach. Cache hit custa 10% do preço
de entrada. Sem ele, cada turno reenviava a conversa inteira como input novo e o
custo crescia ao quadrado: uma sessão de 15 turnos consumia 73.800 tokens de
entrada para 8.500 de conversa real. São dois marcadores, o limite da API é 4:

- no system do Coach (~810 tokens, acima do piso de 512 do Opus 5)
- na última mensagem, para o turno seguinte ler o prefixo do cache

Não foi ligado no Raio-X: o system tem ~275 tokens (abaixo do piso) e cada
análise é uma conversa diferente, então não há prefixo reaproveitável.

**Medição** (`dossiery_uso`): uma linha por chamada, com entrada, saída, cache
lido e cache escrito. Era a premissa mais frágil do estudo (mix de uso presumido
em 60/30/10) e agora vira dado.

**Uso justo:** teto de 300 chamadas por recurso em 30 dias, cerca de 10 por dia
todo dia. É 5x o perfil pesado que a auditoria mediu. O teto existe para pegar
laço automatizado e conta compartilhada, não cliente: quem encostar nele recebe
um convite para falar no suporte, não um bloqueio seco.

---

## Como verificar que o cache está funcionando

Depois das primeiras conversas reais, rode no SQL editor do Supabase:

```sql
-- Se cache_lido ficar em zero depois do segundo turno de uma conversa,
-- alguma coisa está invalidando o prefixo.
select
  recurso,
  count(*)                                             as chamadas,
  round(avg(entrada))                                  as entrada_media,
  round(avg(cache_lido))                               as cache_lido_medio,
  round(100.0 * sum(cache_lido) /
        nullif(sum(entrada + cache_lido + cache_escrito), 0), 1) as pct_cache
from dossiery_uso
where criado_em > now() - interval '7 days'
group by recurso;
```

Custo real em reais por usuário, para substituir a premissa do estudo:

```sql
-- Preços do Opus 5: US$ 5/M entrada, US$ 25/M saída, cache lido a 10% da entrada.
select
  user_id,
  count(*) as chamadas,
  round((sum(entrada + cache_escrito) / 1e6 * 5
       + sum(cache_lido)              / 1e6 * 0.5
       + sum(saida)                   / 1e6 * 25) * 5.11, 2) as custo_brl
from dossiery_uso
where criado_em > now() - interval '30 days'
group by user_id
order by custo_brl desc
limit 20;
```

O topo dessa lista é a cauda de custo. Se o P99 passar de R$ 40/mês com o cache
ligado, aí sim vale reabrir a conversa sobre modelo.

---

## Tier real no banco

O webhook gravava `plano='operador'` para todos os tiers pagos, então Recruta e
Operador ficavam idênticos. Agora grava também `tier` com o valor real da compra
(`recruta` / `operador` / `comandante`).

`plano` continua dizendo apenas se o acesso está liberado. `tier` diz o que a
pessoa comprou. Isso é pré-requisito para medir margem por plano e para aplicar
limites diferentes por tier.

---

## Números do estudo (para comparar depois)

Com o cache ligado e o mix presumido:

| Plano | Margem estimada |
|---|---|
| Recruta R$ 97/mês | ~78% |
| Operador R$ 497/ano | ~70% |
| Comandante R$ 1.297 | ~79% |

CPL máximo com 40% de margem, cenário realista: **R$ 3,71**.
CPA máximo por comprador de tripwire: **R$ 67**.

Relatório completo:
https://claude.ai/code/artifact/9459235e-013a-4cd3-921d-45a4adee9189

---

## O que ainda depende de você

1. Confirmar o custo de parcelamento com a Stripe e ajustar as parcelas se der.
2. Rodar a migração `0007_dossiery_uso_tier.sql`.
3. Rodar `scripts/setup-stripe.mjs` (13 preços) e ativar PIX + parcelamento.
4. Resolver a call de 45 min do Comandante antes de escalar mídia: com 8h por
   semana em calls o teto é R$ 44,6 mil/mês, e ele não se move com verba.
5. Provisionar 12% da receita para devoluções e medir o acionamento real da
   garantia em dobro por 60 dias.
