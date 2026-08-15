# DOSSIERY · VAULT COMPLETO

> Handoff integral do projeto para outro agente/IA assumir o trabalho.
> Gerado em 12/08/2026 a partir do estado real do código e da sessão que o construiu.
> Onde este vault e o código divergirem, o código manda.

## O que é o Dossiery

Produto digital brasileiro de coaching de conquista para homens (bottom-of-funnel,
mercado BR, 100% em português). A pessoa faz um quiz gratuito de 10 cenários
("Raio-X"), recebe um diagnóstico (Índice Modo Trouxa + arquétipo + 3 correções),
e entra numa esteira de resposta direta: tripwire R$19 → order bump R$37 →
planos (R$97/mês, anual R$497-697, R$1.297) → cadeia de 4 OTOs pós-compra →
cross-sell eterno dentro do app pelo preço cheio.

O app entregue tem: Coach (chat com IA), Analisar (raio-x de conversa real com IA),
e 5 produtos de conteúdo com 191 itens escritos.

Motor de IA: claude-opus-5 com prompt caching. Stack: Next.js 16 App Router +
TypeScript + Tailwind 4 + Supabase (auth+Postgres+RLS) + Stripe + Vercel.

## Onde está o código

- Repositório: github.com/contatocardosoeo-sys/excalibur-app
- Branch: claude/dossiery-conquista-platform-cirfjf  ← TUDO está aqui
- A main NÃO tem o Dossiery (o repo abriga outro produto, um SaaS de clínicas)
- 87 arquivos, ~11.900 linhas, namespace /dossiery/* e /api/dossiery/*

## Estado em 12/08/2026 (leia antes de agir)

1. O funil está CONSTRUÍDO e revisado, mas NUNCA houve uma transação completa.
2. Um dev externo (Leo) subiu uma VERSÃO MODIFICADA em dossiery.com.br num
   servidor nginx próprio, FORA do GitHub. Essa versão exige login no checkout
   (o nosso tem guest checkout de propósito). Supabase de lá não está conectado:
   o quiz não salva leads. As duas bases estão divergindo — reconciliar é urgente.
3. A Vercel do repositório está DESLIGADA (402 DEPLOYMENT_DISABLED, billing).
4. Migrações nunca rodaram. Preços do Stripe nunca foram criados.
5. Termos/Privacidade têm placeholders literais ([RAZÃO SOCIAL], [CNPJ]...).
6. Lista completa de pendências: arquivo 07 deste vault.

## Mapa do vault

| Arquivo | O que tem |
|---|---|
| 00-LEIA-PRIMEIRO.md | Este arquivo |
| 01-PRODUTO-E-FUNIL.md | Especificação completa: produtos, preços, páginas, fluxos, regras |
| 02-ARQUITETURA-CODIGO.md | Stack, estrutura de arquivos, decisões técnicas, contratos de API |
| 03-BANCO-E-SEGURANCA.md | Schema, RLS, migrações, as 30 envs |
| 04-PRECIFICACAO-E-UNIT-ECONOMICS.md | Margem, COGS de IA, CPL/CPA, tetos de escala |
| 05-COPY-E-MARKETING.md | Princípios de copy, ads, e-mails, pesquisa de funis |
| 06-DECISOES-E-LICOES.md | Por que cada coisa é como é + erros já cometidos e corrigidos |
| 07-PENDENCIAS-E-PROXIMOS-PASSOS.md | Os 20 itens de lançamento + situação do deploy paralelo |
| 08-CONTEUDO-DOS-PRODUTOS.md | Onde estão os 191 itens e como são estruturados |

## Regras invioláveis do projeto (o dono já decidiu; não reabrir)

1. NUNCA fabricar prova social, depoimento, escassez ou resultado. A lista
   PROVAS está vazia de propósito e o componente não renderiza vazio.
   Motivo: CDC art. 37, CONAR, e bloqueio de conta na Meta. Existe playbook
   de 30 dias para coletar prova real (DOSSIERY-PROVA.md no repo).
2. O produto TREINA O HOMEM. Nunca vigia, analisa ou manipula mulheres.
   O Coach não escreve mensagens fingindo ser o usuário.
3. Zero em-dashes (—) em copy visível ao usuário. Quebrar padrões de IA.
4. Público é fundo de funil: copy agressiva e direta, sem encher linguiça.
5. Escassez sempre REAL e verificada no servidor (janela de 60min devolve 410;
   degraus de preço contados do banco). Nunca falsa urgência.
6. O cliente NUNCA envia preço. Envia tier/oferta; o servidor escolhe o preço.
7. Guest checkout é intencional. Não adicionar login antes do pagamento.
8. Modelo de IA fica em claude-opus-5. Trocar é decisão do dono, não de dev.
