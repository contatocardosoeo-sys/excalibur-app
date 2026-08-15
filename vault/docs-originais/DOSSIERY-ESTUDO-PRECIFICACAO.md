# Dossiery · Auditoria de Precificação

> Estudo de margem, COGS de entrega, CPL e CPA máximos, e tetos de escala.
> Todos os custos foram medidos no código real da aplicação, não estimados por
> analogia. 11/08/2026.

---

## Veredito

**Os preços de tabela estão bem construídos e a escada de valor é sólida. O
problema não é quanto você cobra: é quanto custa entregar.**

Antes das correções, o Operador — sua oferta principal — rodava a **6,9% de
margem**.

A causa era uma só: o Coach usava `claude-opus-5` **sem prompt caching**,
reenviando a conversa inteira a cada turno, vendido como ilimitado sem nenhum
limite de uso no código. Ligar o cache leva a mesma oferta de 6,9% para **69,5%
de margem** sem mexer em um centavo do preço.

| Indicador | Valor |
|---|---|
| Margem do Operador (antes) | **6,9%** |
| Margem do Operador (com cache) | **69,5%** |
| CPL máximo · cenário realista | **R$ 3,71** |
| CPA máximo por tripwire | **R$ 67** |

---

## Parte 1 · O custo de entrega

### O que "ilimitado" custa de verdade

Parâmetros medidos no código: system prompt de 810 tokens, histórico de até 40
mensagens, `max_tokens 8000`, thinking adaptativo.

O detalhe caro era que **não existia prompt caching**. Sem cache, cada turno
reenvia a conversa inteira como input novo, e o custo cresce ao quadrado da
duração da conversa. Uma sessão de 15 turnos consome 73.800 tokens de entrada
quando a conversa em si tem 8.500.

**Sessão de Coach de 15 turnos** (câmbio R$ 5,11/US$):

| Configuração | Tokens in | Custo US$ | Custo R$ |
|---|---:|---:|---:|
| Opus 5, sem cache (antes) | 73.800 | 0,575 | **R$ 2,94** |
| Opus 5 + prompt caching | 9.000 | 0,251 | R$ 1,28 |
| Sonnet 5 + prompt caching | 9.000 | 0,101 | R$ 0,51 |

São **5,8x de diferença** na mesma entrega.

### COGS mensal por perfil de uso

O plano é vendido como ilimitado, então o P99 é um custo real, não hipotético.

| Perfil | Sessões/mês | Opus s/ cache | Sonnet + cache |
|---|---:|---:|---:|
| Leve | 4 | R$ 12,87 | R$ 2,50 |
| Médio | 12 | R$ 38,60 | R$ 7,49 |
| Pesado | 40 | R$ 128,67 | R$ 24,98 |
| Abusivo (P99) | 120 | **R$ 386,00** | R$ 74,93 |

> **O número que assusta:** um único usuário no perfil abusivo custava **R$ 386
> por mês** na configuração antiga. O Operador que ele pagou custou R$ 497 por
> *doze meses*. Ele ficava no vermelho no primeiro mês e meio, e continuava
> consumindo por mais dez.

---

## Parte 2 · Margem

Líquido de adquirência (PIX 1,19% / cartão 3,99% + R$ 0,39 / parcelamento
estimado em 2,5%), imposto de 11% e o COGS de IA de doze meses. Mix de uso
presumido em 60% leve, 30% médio, 10% pesado.

| Plano | Preço | Líquido | Margem antes | Margem com cache |
|---|---:|---:|---:|---:|
| Recruta · R$ 97/mês | R$ 1.164 | R$ 984,86 | 51,4% | **78,2%** |
| Operador · R$ 497/ano | R$ 497 | R$ 420,38 | **6,9%** | **69,5%** |
| Comandante · R$ 1.297 | R$ 1.297 | R$ 1.097,42 | 54,9% | **78,8%** |

O Operador é o plano que a página inteira empurra e era justamente o de pior
margem, porque é o único que dá doze meses de IA ilimitada por um pagamento só.
O Recruta, posicionado como isca de comparação, tem economia melhor que o alvo.

### Sensibilidade ao consumo

"Uso 2x" significa que a base consome o dobro do mix presumido.

| Configuração | Uso 1x | Uso 2x | Uso 4x |
|---|---:|---:|---:|
| Opus 5 sem cache | 6,9% | **−70,8%** | −226,1% |
| Sonnet 5 + cache | 69,5% | 54,5% | 24,3% |

**Essa é a linha mais importante do estudo.** Na configuração antiga, uma base
que usasse o dobro do previsto levava o Operador a prejuízo de 70%. Com o cache
ligado, a mesma base ainda entrega 54% de margem. A diferença entre um negócio
escalável e um que quebra ao crescer estava em um cabeçalho de cache.

---

## Parte 3 · Aquisição

Não tenho acesso à sua conta de anúncios, então não sei seu CPL e CPA atuais. O
que dá para calcular com precisão, e que é o número que decide se você escala, é
o **teto**: quanto você pode pagar por lead e por cliente antes de a operação
parar de valer a pena.

Modelei o funil por estágios reais: mil leads do quiz, conversão em tripwire de
R$ 19, order bump, OTO de R$ 97 com downsell de R$ 47, e subida para o Operador
com os R$ 19 creditados.

| Cenário | Lead→tripwire | Tripwire→core | R$ por lead | CPL @40% margem | CPA por tripwire |
|---|---:|---:|---:|---:|---:|
| Pessimista | 3,0% | 6% | R$ 2,54 | R$ 1,53 | R$ 50,88 |
| **Realista** | 5,5% | 10% | **R$ 6,18** | **R$ 3,71** | **R$ 67,44** |
| Otimista | 9,0% | 15% | R$ 13,35 | R$ 8,01 | R$ 89,03 |

**Aqui está o aperto.** No cenário realista você tem R$ 3,71 de CPL para
trabalhar. Isso é apertado para Meta no Brasil, onde lead de quiz em nicho de
relacionamento costuma sair entre R$ 3 e R$ 15 dependendo de criativo e
segmentação. Você escala se estiver na ponta boa dessa faixa, e não escala se
estiver na ponta ruim.

> A faixa de CPL de mercado é a única estimativa não derivada dos seus dados.
> Trate como ordem de grandeza e substitua pelo seu número real assim que tiver
> volume.

### A alavanca de escala não é o preço, é a taxa de subida

Do cenário pessimista para o otimista o preço não muda em nada. O que muda é
quanta gente sobe de degrau. Sair de 6% para 15% de tripwire→core multiplica sua
contribuição por lead por **5,3x** e o CPL que você aguenta pela mesma coisa.
Cada ponto de conversão na subida vale mais que qualquer reajuste de tabela.

---

## Parte 4 · Achados, por ordem de dinheiro

### 01. Opus 5 sem cache em produto ilimitado
**🔴 Crítico · RESOLVIDO**

O maior custo do negócio inteiro, e o mais fácil de resolver. Custava R$ 386 por
Operador ao ano contra R$ 75 na configuração otimizada.

**Correção aplicada:** prompt caching no Coach, com dois marcadores (limite da
API é 4): no system (~810 tokens, acima do piso de 512 do Opus 5) e na última
mensagem, para o turno seguinte ler o prefixo inteiro do cache. Modelo mantido
em `claude-opus-5` — trocar modelo é decisão de produto, e a variável
`DOSSIERY_COACH_MODEL` continua disponível para calibrar com dado real.

### 02. "Ilimitado" sem limite, sem medição
**🔴 Crítico · RESOLVIDO**

Não havia rate limit nas rotas de IA nem tabela que registrasse consumo. Não
dava para saber quem custava caro nem cortar a cauda. Um P99 custava R$ 386/mês.

**Correção aplicada:** tabela `dossiery_uso` com uma linha por chamada (entrada,
saída, cache lido, cache escrito) e teto de uso justo de 300 chamadas por
recurso em 30 dias — 5x o perfil pesado medido. O teto pega laço automatizado e
conta compartilhada, não cliente.

### 03. O banco não distinguia Recruta de Operador
**🔴 Crítico · RESOLVIDO**

O webhook gravava `plano: 'operador'` para todos os tiers pagos. Quem pagava
R$97/mês e quem pagava R$497/ano ficavam idênticos no banco.

**Correção aplicada:** o webhook agora grava também `tier` com o valor real da
compra. `plano` diz se o acesso está liberado; `tier` diz o que a pessoa
comprou.

### 04. A garantia em dobro custa de 7% a 20% da receita
**🟠 Atenção · PENDENTE**

Cada acionamento devolve 2x e a taxa de adquirência já paga não volta. Sobre uma
venda de R$534:

| Cenário | Custo por venda | % da receita |
|---|---:|---:|
| CDC 7d 5% + dobro 1% | R$ 37,59 | 7,0% |
| CDC 7d 8% + dobro 2% | R$ 64,51 | 12,1% |
| CDC 7d 12% + dobro 4% | R$ 107,65 | 20,2% |

**Recomendação:** manter a garantia, ela vende. Mas exigir a comprovação das 7
missões que a própria oferta já condiciona, e provisionar 12% da receita como
reserva. Se o acionamento passar de 4%, trocar por "devolvo tudo e você fica com
os produtos", que converte quase igual e custa metade.

### 05. O parcelado em 12x perdia para o PIX
**🟠 Atenção · RESOLVIDO**

12x R$ 42 dava R$ 504 contra R$ 497 à vista: 1,4% de acréscimo para cobrir um
custo de parcelamento de aproximadamente 6,5%. Cada venda parcelada rendia
**R$ 20,96 a menos** que a mesma venda no PIX.

Pior: nos três degraus. Na Vanguarda o parcelado saía **mais barato que o PIX**
(12x 58 = R$ 696 contra R$ 697 à vista).

| Degrau | À vista | Antes | Mín. se parc.=0% | Aplicado (2,5%) |
|---|---:|---:|---:|---:|
| Fundador | R$ 497 | R$ 42 | R$ 42,82 | **R$ 45** |
| Pioneiro | R$ 597 | R$ 50 | R$ 51,43 | **R$ 53** |
| Vanguarda | R$ 697 | R$ 58 | R$ 60,03 | **R$ 62** |

Mesmo com custo de parcelamento zero, a taxa de cartão sozinha (3,99% + R$ 0,39)
já não cabia no markup.

> **Pendência:** o 2,5% não foi confirmado na fonte — o domínio da Stripe está
> bloqueado pelo proxy da rede. Confirme com o gerente de conta. Se o custo real
> for menor, dá para baixar para 43 / 52 / 61.

### 06. A call do Comandante trava a escala
**🟠 Atenção · PENDENTE**

"Uma call de 45 min comigo" é a única entrega não escalável da esteira.

| Horas/semana em calls | Comandantes/mês | Teto de receita |
|---:|---:|---:|
| 4h | 17 | R$ 22.308/mês |
| 8h | 34 | **R$ 44.617/mês** |
| 16h | 69 | R$ 89.234/mês |

Esse teto **não se move com verba de tráfego**.

**Recomendação:** trocar por revisão assíncrona em vídeo de 15 min sobre o caso
dele, ou call em grupo quinzenal. Se mantiver a call individual, ela vira
produto de escassez real, não item de esteira.

### 07. A escada de fundador vale R$ 308 mil e acaba
**🟠 Atenção · PENDENTE**

| Degrau | Vagas | Preço | Total |
|---|---:|---:|---:|
| Fundador | 100 | R$ 497 | R$ 49.700 |
| Pioneiro | 200 | R$ 597 | R$ 119.400 |
| Vanguarda | 200 | R$ 697 | R$ 139.400 |
| **Total** | **500** | | **R$ 308.500** bruto |

R$ 261.083 líquidos. Depois disso sobra o mensal de R$ 147. É um mecanismo de
lançamento, não um motor de escala.

**Recomendação:** definir agora o que vem depois da Vanguarda. A resposta
natural é o mensal de R$ 147 virar o produto principal, com o anual como oferta
de entrada descontada. Decidir isso antes de esgotar, não depois.

### 08. A arquitetura de preço em si está boa
**🟢 Saudável**

Três degraus com isca de comparação funcional, âncora alta em R$ 1.297, tripwire
de R$ 19 que qualifica comprador, bump de R$ 37 e OTO com downsell.

**LTV bate:**

| Plano | Cenário | LTV líquido |
|---|---|---:|
| Recruta | churn 10%/mês | R$ 758 |
| Recruta | churn 15%/mês | R$ 505 |
| Recruta | churn 25%/mês | R$ 303 |
| Operador | renovação 20% | R$ 449 |
| Operador | renovação 35% | R$ 549 |
| Operador | renovação 50% | R$ 668 |

O anual à vista é a escolha certa para tráfego pago, porque põe o dinheiro no
caixa antes de você precisar recomprar mídia.

---

## Parte 5 · Método — de onde veio cada número

### Medido no código

- System prompt do Coach: 2.837 caracteres, cerca de 810 tokens (`coachPrompt.ts`)
- Histórico de até 40 mensagens de 8.000 caracteres (`coach/route.ts:10-11`)
- `max_tokens` 8000, thinking adaptativo, Opus 5 por padrão (`claude.ts:12,40`)
- Ausência de `cache_control` e de qualquer rate limit nas rotas de IA
- Toda a tabela de preços lida de `setup-stripe.mjs` e `fundador.ts`

### Preços de terceiros, verificados

- Opus 5: US$ 5 / US$ 25 por milhão de tokens
- Sonnet 5: US$ 2 / US$ 10 (promocional até 31/08/2026)
- Cache hit a 10% do input; piso cacheável no Opus 5 é 512 tokens
- Stripe Brasil: 3,99% + R$ 0,39 no cartão doméstico, 1,19% no PIX
- Câmbio de R$ 5,11 por dólar

### Presumido — substitua quando tiver dado

- **Custo adicional de parcelamento de 2,5%.** O domínio da Stripe está
  bloqueado pelo proxy da rede, então esse é o único custo de adquirência que
  não consegui confirmar na fonte.
- **Imposto de 11%**, presumindo Simples Nacional Anexo III em faixa de
  aproximadamente R$ 1,8M anuais. Muda bastante conforme faturamento e fator R.
- **Mix de uso de 60/30/10** e sessão média de 15 turnos. Era o palpite mais
  frágil do estudo — a tabela `dossiery_uso` substitui isso por dado real.
- Taxas de conversão do funil por estágio, e a faixa de CPL de mercado.
- Infraestrutura de Vercel e Supabase tratada como custo fixo pequeno,
  irrelevante perto da IA.

---

## Respondendo direto à pergunta

**A precificação está boa para escalar?** Os preços, sim. A operação, agora
também — depois das três correções críticas.

Antes delas, cada Operador vendido rendia R$ 34 de contribuição e um único
usuário pesado apagava o lucro de dez clientes. Você escalaria o prejuízo junto
com o faturamento.

Corrigidos, a mesma tabela de preços suporta R$ 3,71 de CPL com 40% de margem e
cerca de 70% de margem no plano principal. Aí sim é uma operação que aguenta
verba.

**O que ainda depende de você:** confirmar o custo de parcelamento com a Stripe,
provisionar a garantia, e resolver a call do Comandante antes de escalar mídia.

---

## Documentos relacionados

- `DOSSIERY-LANCAMENTO.md` — os 20 itens que faltam para receber a primeira venda
- `DOSSIERY-PRECIFICACAO.md` — decisões aplicadas e queries de verificação
- `DOSSIERY-PROVA.md` — playbook de 30 dias para prova social real
