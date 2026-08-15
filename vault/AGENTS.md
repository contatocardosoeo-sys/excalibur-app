# Dossiery — instruções para o agente

Você está assumindo o Dossiery, um funil de venda + app com IA para coaching
de conquista (mercado BR, pt-BR). Este vault é o handoff completo.

## Leia nesta ordem
1. 00-LEIA-PRIMEIRO.md — o que é, onde está o código, estado atual
2. 07-PENDENCIAS-E-PROXIMOS-PASSOS.md — o que está quebrado AGORA
3. O arquivo do seu tema (01 funil · 02 código · 03 banco · 04 preço · 05 copy)

## Regras que o dono já decidiu (não reabrir sem ordem dele)
- Nunca fabricar prova social/depoimento/escassez (CDC art. 37, Meta)
- O produto treina o homem; nunca vigia ou manipula mulheres
- Zero em-dash (—) em copy visível; quebrar padrões de texto de IA
- Escassez sempre real e verificada no servidor
- Cliente nunca envia preço; servidor escolhe pelo banco
- Guest checkout é intencional (não exigir login antes de pagar)
- Modelo de IA: claude-opus-5 (trocar é decisão do dono)
- Prompt caching do Coach não pode ser removido (margem 6,9%→69,5%)

## Fatos operacionais
- Código: github.com/contatocardosoeo-sys/excalibur-app,
  branch claude/dossiery-conquista-platform-cirfjf (a main NÃO tem o produto)
- dossiery.com.br roda versão MODIFICADA fora do git (reconciliar primeiro!)
- Nunca houve uma transação completa; roteiro de teste no arquivo 03
- DOSSIERY_GATE=off e DOSSIERY_PAYWALL=off NUNCA em produção
