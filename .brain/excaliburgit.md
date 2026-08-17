# EXCALIBURGIT, deploy e a divergencia GitHub/Forgejo

Dados confirmados por Enio (dev senior) em 17/08/2026, com saida de comando
do servidor. **Substitui a versao anterior deste arquivo, que estava errada**:
ela supunha que producao nao acompanhava o canonico por falta de dual push.
Acompanha. A causa da divergencia e outra.

## Topologia real de producao

| Item | Valor |
|---|---|
| Diretorio | `/home/projects/excalibur-app` |
| Repositorio canonico | `ia-maquiavelica/excalibur-app` no EXCALIBURGIT (Forgejo) |
| Remote de fetch e push | EXCALIBURGIT |
| Branch de producao | `claude/dossiery-conquista-platform-cirfjf` |
| Runtime | Docker Compose, container `dossiery-app` |
| Build | no proprio servidor |
| Deploy | `dossiery-deploy.timer`, consulta o Forgejo a cada minuto |
| nginx | encaminha o dominio pra porta interna 4026 |
| Banco | PostgreSQL local, container `dossiery-postgres` |
| Migracoes | Drizzle, rodadas automaticamente na inicializacao |
| Host | 200.187.72.153, mesmo do EXCALIBURGIT |
| DNS | A record direto, sem Cloudflare |
| SSL | Let's Encrypt, renovacao automatica, vence 09/11/2026 |
| Vercel | nao serve producao |

Producao ja e automatica. Commit empurrado pro Forgejo entra no ar em ate um
minuto. Nao ha nada pra consertar no mecanismo de deploy.

## A divergencia

Ponto de fork: `b2f63d5`. Antes dele, as duas linhagens sao a mesma.

| Lado | Estado |
|---|---|
| `main` | `e297ba8`, identica nos dois |
| Forgejo, branch de prod | `69b8773` · 24 commits exclusivos |
| GitHub, mesma branch | `b456351` · 5 commits exclusivos |

**As duas linhagens nao sao a mesma implementacao.** Depois do fork, o lado do
Forgejo portou o produto de Supabase para **PostgreSQL local com Drizzle**, em
Docker. O lado do GitHub seguiu em Supabase: 31 arquivos ainda importam
`@supabase/supabase-js`, e nao existe Drizzle nem Dockerfile nesse checkout.

Nao e conflito de merge. E decisao de arquitetura.

## O que ha de fato nos 5 commits do GitHub

| Commit | Conteudo | Vale portar? |
|---|---|---|
| `6fb4abf` | adiciona `vault/` | Nao |
| `4561b54` | adiciona `dossiery-vault.zip` | Nao |
| `d802c44` | remove os dois acima | Nao |
| `f56e000` | middleware, 13 linhas | **Parcialmente** |
| `b456351` | `.brain/`, so documentacao | Reescrito neste commit |

Os tres primeiros somam **efeito liquido zero**: `git diff 6fb4abf~1 d802c44`
volta vazio. Adicionaram o vault e tiraram. Nao portar.

Do `f56e000`, producao **ja tem** o tratamento de `/api/dossiery/*` e
`/dossiery/raio-x` publico. Sobra o que Enio confirmou como bug aberto:

```ts
// em publicosDossiery, no middleware.ts
'/dossiery/entrando',  // ponte do guest checkout: chega pago e sem sessao
'/dossiery/garantia',
```

Sem `/dossiery/entrando` na lista, quem paga como convidado volta do Stripe e
cai na tela de login em vez de entrar logado.

**Conclusao: nao rodar `push --all` nem merge da branch do GitHub.** O que
existe de util e uma linha, e ela deve ser aplicada direto no Forgejo.

## Pendencia de decisao: Supabase ou Postgres local

Producao roda Postgres local com Drizzle. As 7 migracoes em
`supabase/migrations/` **nao sao o mecanismo usado**. Precisa decidir
deliberadamente qual dos dois fica.

Consequencia que depende dessa decisao:

- `app/lib/dossiery/uso.ts` e a migracao `0007_dossiery_uso_tier.sql`
  implementam a medicao de uso e o teto de uso justo. Foram escritos contra
  Supabase.
- Sem eles em producao, nao ha teto de consumo no Coach nem registro em
  `dossiery_uso`.
- O estudo em `DOSSIERY-ESTUDO-PRECIFICACAO.md` mostra a margem do Operador
  indo de 69,5% para 6,9% sem prompt caching, e para negativa com uso 2x sem
  teto.

**Confirmar se o build de producao inclui o prompt caching e a medicao de uso.**
Se nao incluir, isso e bloqueio comercial, nao divida tecnica.

## Acesso

`cardosoeo` e administrador do Forgejo e tem nivel administrativo no
`ia-maquiavelica/excalibur-app`.

O agente na nuvem **nao alcanca** o host: o proxy de egress do ambiente
devolve 403 no CONNECT para `git.plataformaexcalibur.com.br`, e tambem para
Stripe, Supabase, Vercel e `dossiery.com.br`. So GitHub e a API da Anthropic
passam. Verificado host a host em 17/08/2026. Nao e credencial, e rota. Para
mudar, os hosts precisam entrar na allowlist de egress do ambiente:
https://code.claude.com/docs/en/claude-code-on-the-web
