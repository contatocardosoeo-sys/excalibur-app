# 06 · DECISÕES TOMADAS E LIÇÕES APRENDIDAS

Registro de POR QUE as coisas são como são. Não reabrir sem motivo novo.

## Decisões de produto

1. GUEST CHECKOUT (a conta nasce DEPOIS do pagamento): cadastro antes de pagar
   perde 20-35% da conversão mobile. A ponte /entrando cria conta via webhook
   e abre sessão via magiclink verifyOtp. Se falhar, tela honesta "acesso por
   e-mail" — nunca some com o dinheiro.
2. ANUAL É PAGAMENTO ÚNICO, não assinatura: caixa na frente (melhor pra
   tráfego pago) e zero cobrança surpresa no aniversário. Renovação é oferta
   ativa no D330, não débito automático.
3. BUMP PRÉ-MARCADO com transparência total: título diz que soma ao plano,
   estado explícito ("Marcado. Toque pra tirar."), resumo do pedido mostra
   cada linha antes do botão. Nenhum número novo no checkout.
   Conservador? useState(false) na linha 13 de precos/page.tsx.
4. DOWNSELL É O MESMO PRODUTO sem cortes (R$97→R$47). Integridade > margem
   do downsell. A âncora verdadeira é o preço do app (R$147).
5. STUBS HONESTOS: módulos futuros mostram "Em construção · Fase N" com o que
   farão. Nunca fingir pronto. (Mas ver pendência do Campo em 07!)
6. MODELO OPUS 5 MANTIDO: trocar por Sonnet economizaria mais, mas é decisão
   de produto do dono. DOSSIERY_COACH_MODEL existe pra calibrar com dado real.

## Decisões técnicas

1. PREÇO SEMPRE DO SERVIDOR: cliente manda tier/oferta, faixaAtual() escolhe
   o degrau contando vendas reais. Front nunca envia valor.
2. ESCASSEZ VERIFICADA: janela de 60min → 410 no servidor; countdown lê o
   mesmo prazo (janela.ts). Vagas contadas do banco.
3. PROMPT CACHING com 2 marcadores (system + última mensagem). Margem do
   Operador: 6,9% → 69,5%. A decisão mais valiosa do projeto em R$/linha.
4. MEDIÇÃO DE USO fire-and-forget: nunca derruba a resposta do usuário.
5. RLS SELECT-ONLY em assinaturas e uso: escrita só via service-role.
6. ENTITLEMENTS IRREVERSÍVEIS (nunca voltam a false): simplifica suporte.
7. SONS SINTETIZADOS (Web Audio) no quiz: zero assets, zero request.

## Erros já cometidos e corrigidos (não repetir)

1. RLS dono_all FOR ALL: usuário podia se dar plano pago via PostgREST.
   Corrigido na 0004. NUNCA criar política FOR ALL em tabela de billing.
2. Preço da manchete ≠ preço do botão (12x42/497 vs botão 534 com bump).
   Corrigido com resumo do pedido. REGRA: todo número visível reconcilia.
3. Parcelas 42/50/58 não cobriam nem taxa de cartão (Vanguarda: parcelado
   mais barato que PIX). Corrigido para 45/53/62 (empate de líquido).
4. Coach sem cache: custo quadrático no histórico. 15 turnos = 73.800 tokens.
5. Webhook gravava plano='operador' pra todo tier: Recruta e Operador
   idênticos no banco. Corrigido com coluna tier (0007).
6. "Ilimitado" sem medição nem teto: P99 custaria R$386/mês invisível.
   Corrigido com dossiery_uso + teto 300/30d.
7. Quiz com foco preso ao avançar pergunta (DOM reusado): key por pergunta +
   blur() + hover só em pointer:fine.
8. OTO1 dizia "só nesta tela R$97" e o downsell da tela seguinte era R$47:
   quebrava integridade. Corrigido para "na janela pós-compra".
9. Em-dashes por todo lado denunciavam texto de IA: varridos (60 só no
   plano7dias.ts).
10. Higgsfield/preview: 401 até publicar; cache de borda serve HTML velho
    (validar com cache-buster antes de concluir que o deploy falhou).

## Como trabalhar com o dono (Matheus)

Direto, quer velocidade ("faça tudo!", "suba tudo!"), pt-BR sempre.
Aceita não como resposta quando há razão legal/ética (aceitou provas vazias
quando expliquei CDC/Meta). Gosta de entregável pronto (PDF, links, .md no
repo). Time: Enio (subiu o deploy paralelo), Leo Gazio (dev, ficou de pegar
o PDF do funil). WhatsApp é o canal deles.
