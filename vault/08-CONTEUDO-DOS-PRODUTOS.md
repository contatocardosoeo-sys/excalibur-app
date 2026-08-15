# 08 · CONTEÚDO DOS PRODUTOS (191 itens)

O conteúdo NÃO está neste vault (seria cópia do código). Está nos arquivos
TypeScript, que são a fonte da verdade:

| Arquivo (app/lib/dossiery/) | Produto | Itens | Estrutura |
|---|---|---|---|
| kitAberturas.ts | Kit 50 Aberturas | 50 | grupos por situação; cada item {t: texto, p: porquê} |
| protocoloEncontro.ts | Protocolo Encontro | 34 | 7 fases (Fechar a Data → D+1); {t, p} |
| perfilMagnetico.ts | Perfil Magnético | 37 | ações por seção do perfil; {t, p} |
| protocoloRecomeco.ts | Protocolo Recomeço | 30 | fases de reconstrução; {t, p} |
| plano7dias.ts | Plano 7 Dias | 40 | 7 dias {dia, titulo, codinome, missao, briefing, passos[], criterio} |
| raioX.ts | Quiz | 10 perguntas | {q, opcoes: [{t, pesos}]} + 6 RESULTADOS |

## Padrão editorial do conteúdo

- Todo item tem o PORQUÊ ("por quê ·"): nada é pra copiar cego. A regra da
  casa aparece no topo do Kit: "Copiar sem adaptar é Modo Trouxa com atalho."
- Campos entre colchetes [campo] são pra pessoa trocar pelo contexto real.
- Missão do Plano 7 Dias se cumpre NO dia; tem critério de "cumprida quando".
- Voz: direta, tática, zero em-dash, exemplos concretos.

## Coach e Analisar (IA)

COACH_SYSTEM (~810 tokens, coachPrompt.ts): treina O USUÁRIO. Não escreve
mensagens por ele, não passa pano, aponta o vacilo e dá a próxima rep.
ANALISAR_SYSTEM (~275 tokens): recebe conversa real e devolve diagnóstico
JSON (schema em analisar/route.ts) — pontos, vacilo principal, próxima jogada.
Ambos com a trava ética: treinar o homem, nunca operar sobre a mulher.

## Se for portar o conteúdo pra outra plataforma

Os .ts exportam arrays tipados — um script de 10 linhas converte pra JSON/CSV.
Manter os porquês junto dos textos: são o diferencial do produto.
