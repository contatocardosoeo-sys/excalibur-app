# Dossiery · Checklist de Lançamento

> Levantamento verificado no código e nos serviços em 11/08/2026.
> Estado dos serviços checado por requisição HTTP; estado do código por leitura
> direta do repositório.

**20 itens.** Quatro travam tudo, sete são risco legal ou de dinheiro, nove são
acabamento. **Vendas possíveis hoje: zero.**

---

## Situação atual

| Item | Estado | Verificado em |
|---|---|---|
| Código do funil | ✅ completo | branch, 28 commits |
| Conteúdo (191 itens) | ✅ completo | 5 produtos |
| Caminho da compra | ✅ completo | checkout → webhook → acesso |
| App na Vercel | 🔴 desligado | `402 DEPLOYMENT_DISABLED` |
| Código em produção | 🔴 ausente | 0 arquivos na `main` |
| Domínio próprio | 🔴 sem DNS | não resolve |
| Stripe | 🔴 sem preços | setup não rodou |
| Banco | 🔴 sem tabelas | 7 migrações pendentes |
| Site Higgsfield | 🟠 lista de espera | 200, sem checkout |

---

## Bloco 1 · Travam tudo

*Enquanto os quatro estiverem abertos, ninguém consegue nem abrir a página.*

### - [ ] 01. Religar o projeto na Vercel
**🔴 Trava · Você**

Todas as rotas, inclusive a raiz, respondem `402` com o header
`x-vercel-error: DEPLOYMENT_DISABLED`. Isso é a plataforma, não o seu código: é
o que a Vercel devolve quando o projeto está pausado por cobrança ou por limite
de gasto atingido.

**Como resolver:** Painel da Vercel → Settings → Billing. Ver se é cartão
recusado, plano expirado ou spend limit batido. Sem isso, os outros 19 itens não
têm onde rodar.

### - [ ] 02. Levar o código para produção
**🔴 Trava · Eu, se pedir**

A `main` tem **zero arquivos** do Dossiery. Todo o produto está na branch
`claude/dossiery-conquista-platform-cirfjf`, 28 commits à frente. A Vercel serve
a `main`, então mesmo religada ela não serviria o produto.

**Como resolver:** Abro o PR da branch para a `main` quando você mandar. Não
abri por conta própria porque publicar em produção é decisão sua.

### - [ ] 03. Rodar as 7 migrações
**🔴 Trava · Você**

Sem elas o banco não tem as tabelas: cadastro, assinaturas, entitlements, leads
e consumo de IA. O webhook grava em tabela que não existe e a compra não libera
nada.

```
0001_dossiery_schema.sql        0005_dossiery_esteira.sql
0002_dossiery_billing.sql       0006_dossiery_guest_renovacao.sql
0003_dossiery_kit.sql           0007_dossiery_uso_tier.sql
0004_dossiery_funil.sql
```

**Como resolver:** SQL editor do Supabase, na ordem numérica.

> ⚠️ A **0004** contém uma correção de segurança: a política antiga deixava o
> usuário fazer `UPDATE` na própria assinatura pelo PostgREST, ou seja, se dar
> plano pago sozinho. **Não pule.**

### - [ ] 04. Criar os 13 preços no Stripe
**🔴 Trava · Você**

O checkout monta a sessão a partir de IDs de preço vindos de variáveis de
ambiente. Nenhum existe ainda, então toda tentativa de compra falha.

```bash
node scripts/setup-stripe.mjs
```

**Como resolver:** O script é idempotente (usa `lookup_key`) e cria 6 produtos e
13 preços. Ele imprime os IDs no final: são exatamente os valores das
`STRIPE_PRICE_*` do item 05.

---

## Bloco 2 · Configuração

### - [ ] 05. Preencher as 30 variáveis de ambiente
**🔴 Trava · Você**

Levantei do código todas as que ele lê. Sem as obrigatórias o app sobe e quebra
na primeira ação.

```bash
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Os 13 preços (saem do script do item 04)
STRIPE_PRICE_MENSAL
STRIPE_PRICE_ANUAL
STRIPE_PRICE_ANUAL_T1
STRIPE_PRICE_ANUAL_T2
STRIPE_PRICE_ANUAL_T3
STRIPE_PRICE_COMANDANTE
STRIPE_PRICE_BUMP
STRIPE_PRICE_PLANO7
STRIPE_PRICE_ENCONTRO_OTO
STRIPE_PRICE_ENCONTRO_DOWN
STRIPE_PRICE_ENCONTRO_APP
STRIPE_PRICE_PERFIL_OTO
STRIPE_PRICE_PERFIL_APP
STRIPE_PRICE_RECOMECO_OTO
STRIPE_PRICE_RECOMECO_APP
STRIPE_PRICE_OPERADOR_CREDITO
STRIPE_PRICE_RENOVACAO

# Cron de renovação (item 07)
DOSSIERY_CRON_SECRET

# Rastreamento (item 18)
NEXT_PUBLIC_META_PIXEL_ID
META_CAPI_TOKEN
NEXT_PUBLIC_GA4_ID

# Opcionais — NÃO defina em produção
DOSSIERY_GATE=off        # desliga login e paywall
DOSSIERY_PAYWALL=off     # libera conteúdo pago
DOSSIERY_COACH_MODEL     # troca o modelo do Coach
```

> ⚠️ `DOSSIERY_GATE=off` e `DOSSIERY_PAYWALL=off` existem para preview. Se
> vazarem para produção, **o produto inteiro fica de graça.**

### - [ ] 06. Apontar o webhook do Stripe
**🔴 Trava · Você**

Sem webhook o dinheiro entra e o acesso não libera. É a falha mais cara
possível: cliente pagou e não recebeu.

```
URL:     https://SEU-DOMINIO/api/webhooks/stripe
Eventos: checkout.session.completed
         checkout.session.async_payment_succeeded   ← PIX cai aqui
         customer.subscription.updated
         customer.subscription.deleted
```

> ⚠️ O evento de PIX é **separado** do de cartão. Sem
> `async_payment_succeeded`, toda compra no PIX fica paga e sem acesso.

### - [ ] 07. Agendar o cron de renovação
**🟠 Risco · Você**

Existe `/api/dossiery/renovacoes`, que avisa quem está perto do D330, e ela
exige `DOSSIERY_CRON_SECRET`. Mas **não existe `vercel.json`** no repositório,
então nada chama essa rota. O acesso anual expira em silêncio e a renovação de
R$597 nunca é oferecida.

**Como resolver:** Criar `vercel.json` com um cron diário apontando para a rota,
ou agendar de fora. Posso escrever o arquivo se quiser.

### - [ ] 08. Ativar PIX e parcelamento
**🟠 Risco · Você**

A página promete "PIX à vista ou 12x no cartão". Os dois precisam estar
habilitados na conta Stripe Brasil, senão a promessa não se cumpre no checkout.

**Aproveite para confirmar:** o custo real do parcelamento. Usei 2,5% estimado
porque o domínio da Stripe está bloqueado pela rede daqui. As parcelas hoje são
**45 / 53 / 62**; se o custo real for menor, dá para baixar para 43 / 52 / 61.

### - [ ] 09. Configurar o domínio
**🟠 Risco · Você**

Nem `app.excalibur.com.br` nem `excalibur.com.br` resolvem DNS. Dá para lançar
no domínio da Vercel, mas checkout em domínio genérico derruba confiança
justamente na hora de pagar.

---

## Bloco 3 · Legal e integridade

*Nenhum destes impede o sistema de funcionar. Todos impedem que ele funcione sem
risco.*

### - [ ] 10. Preencher os dados da empresa
**🔴 Legal · Você**

Termos e Política de Privacidade estão publicados com **placeholders literais**
entre colchetes, visíveis para qualquer visitante:

```
Termos:      [RAZÃO SOCIAL] [CNPJ] [ENDEREÇO]
             [E-MAIL DE SUPORTE] [CIDADE/UF] [DATA]
Privacidade: [RAZÃO SOCIAL] [CNPJ] [E-MAIL DE PRIVACIDADE] [DATA]
```

**Por que é bloqueio:** O CDC exige identificação clara do fornecedor, e a LGPD
exige canal do encarregado. Vender com isso no ar é indefensável em qualquer
reclamação, e adquirente costuma pedir esses dados na análise de risco.

### - [ ] 11. Tirar "Campo" da página de preços
**🔴 Legal · Eu, se pedir**

O card do Recruta vende *"Raio-X, Coach e Campo ilimitados"*. O módulo Campo é
stub e exibe "Em construção · Fase 2". Quem pagar R$97/mês clica e não encontra
o que comprou.

**Como resolver:** Tirar da copy até existir, ou construir antes de abrir venda.
Publicidade de recurso inexistente é CDC art. 37, e é o tipo de coisa que vira
estorno em massa.

### - [ ] 12. Construir a tela de Conta
**🟠 Legal · Eu, se pedir**

`/dossiery/conta` é stub, e é onde ficariam duas obrigações: o painel LGPD
(exportar e apagar dados) e a gestão de plano. A Base e a tela de renovação já
linkam para lá.

**Boa notícia:** a rota `/api/dossiery/portal` já existe e funciona — cria sessão
do billing portal da Stripe — mas **nenhuma tela aponta para ela**. O billing
self-service está construído, só não exposto. Ligar isso é pequeno.

### - [ ] 13. Recrutar prova social real
**🟠 Risco · Você**

A lista `PROVAS` está vazia de propósito e o componente não renderiza nada
enquanto estiver assim. Isso é correto: depoimento inventado é CDC art. 37 e
derruba conta de anúncio na Meta.

**Como resolver:** O playbook de 30 dias está em `DOSSIERY-PROVA.md`: recrutar
20 beta founders, coletar resultado documentado com autorização de uso por
escrito. Cada prova entra com `autorizado: true`.

### - [ ] 14. Provisionar a garantia em dobro
**🟠 Risco · Você**

Devolver 2x custa entre 7% e 20% da receita conforme o acionamento, e a taxa de
adquirência já paga não volta. Sobre uma venda de R$534 isso vai de R$38 a R$108.

**Como resolver:** Separar 12% da receita como reserva e medir o acionamento
real por 60 dias. Se passar de 4%, trocar por "devolvo tudo e você fica com os
produtos", que converte quase igual e custa metade.

### - [ ] 15. Resolver a call do Comandante
**🟠 Risco · Você**

"Uma call de 45 min comigo" é a única entrega não escalável da esteira. Com 8
horas por semana em calls o teto é **R$44,6 mil/mês**, e ele não se move com
verba de tráfego. Vender além disso é vender o que você não consegue entregar.

**Como resolver:** Trocar por revisão assíncrona em vídeo de 15 min sobre o caso
dele, ou call em grupo quinzenal. Se mantiver individual, ela vira produto de
escassez real, com vagas limitadas explícitas.

---

## Bloco 4 · Antes do primeiro real de mídia

### - [ ] 16. Uma compra de teste real, ponta a ponta
**🔴 Trava · Você**

Enquanto isso não acontecer, "está no ar" é presunção. **Nunca houve uma
transação completa neste sistema.**

- [ ] Comprar o tripwire de R$19 como visitante, sem conta prévia
- [ ] Confirmar que a conta é criada e a sessão abre sozinha em `/dossiery/entrando`
- [ ] Aceitar a OTO de R$97 e confirmar cobrança em 1 clique no cartão salvo
- [ ] Recusar e confirmar que o downsell de R$47 aparece
- [ ] Repetir tudo pagando no PIX (caminho de webhook diferente)
- [ ] Conferir que a janela de 60 min realmente expira e devolve 410
- [ ] Conferir a linha em `dossiery_uso` depois de falar com o Coach

### - [ ] 17. Verificar que o cache está pegando
**🟠 Dinheiro · Você, com a query pronta**

Não consegui testar com chamada real: não há chave da Anthropic neste ambiente.
Validei o formato do wire contra a referência da API, mas a confirmação de
verdade vem do primeiro uso.

```sql
select recurso,
       round(avg(cache_lido)) as cache_medio,
       round(100.0 * sum(cache_lido) /
         nullif(sum(entrada + cache_lido + cache_escrito), 0), 1) as pct
from dossiery_uso
where criado_em > now() - interval '7 days'
group by recurso;
```

**O que esperar:** Se `cache_lido` ficar em zero depois do segundo turno de uma
conversa, alguma coisa está invalidando o prefixo e a margem do Operador volta
para 6,9%. Me manda o resultado que eu diagnostico.

### - [ ] 18. Validar Pixel e CAPI
**🟠 Dinheiro · Você**

O código dispara Pixel no navegador e CAPI no servidor com o mesmo `event_id`
para deduplicar. Se o `event_id` não bater, a Meta conta a mesma venda duas
vezes e o ROAS que você vai otimizar é fantasia.

**Como resolver:** Events Manager → Testar eventos. Confirmar que Purchase
aparece uma vez, não duas, e que a coluna de deduplicação acusa o par.

### - [ ] 19. Decidir os quatro módulos restantes
**Você**

Arena, Conexões, Academia e Evolução seguem como "Em construção". Não são
vendidos em lugar nenhum, então não há risco legal — mas a navegação mostra 10
itens e 4 ficam vazios, o que faz o app parecer oco para quem acabou de pagar.

**Opções:** Esconder da navegação até existirem, ou manter como roadmap visível.
Para teste com beta founders, manter visível funciona: mostra para onde o
produto vai.

### - [ ] 20. Publicar o site de captura
**Decisão sua**

O <https://dossiery.higgsfield.app> está no ar e funcional, mas é lista de
espera: os botões dizem "Entrar na lista" e levam ao quiz, sem checkout.

**Serve para:** Rodar captação de leads e validar o quiz **antes** do app estar
de pé. Se quiser começar a encher a lista enquanto resolve os itens 01 a 04, ele
já faz isso hoje.

---

## Resumo · O caminho crítico

> **Vercel religada → código na main → migrações → preços no Stripe → envs →
> webhook → dados legais → Campo fora da copy → compra de teste.**

Esses nove, nessa ordem, são o mínimo para receber dinheiro sem risco. O resto
pode correr em paralelo ou depois do primeiro cliente.

### O que eu resolvo agora, se você mandar

- Abrir o PR da branch para a `main` (item 02)
- Tirar Campo da copy do Recruta (item 11)
- Construir a tela de Conta com o billing portal que já existe + painel LGPD (item 12)
- Escrever o `vercel.json` do cron (item 07)

### O que depende de acesso que eu não tenho

Painel da Vercel, Supabase, Stripe, DNS, dados da empresa e os beta founders —
os outros dezesseis itens.
