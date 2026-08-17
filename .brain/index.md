# Brain do Projeto excalibur-app

Repositorio: `contatocardosoeo-sys/excalibur-app`
Contem DOIS produtos no mesmo codigo:

| Produto | Namespace | Publico |
|---|---|---|
| Excalibur (clinicas) | `/`, `/dashboard`, `/pacientes`, ... | Clinicas odontologicas, multi-tenant por `clinica_id` |
| Dossiery | `/dossiery/*`, `/api/dossiery/*` | Produto proprio, auth propria, funil proprio |

O `middleware.ts` separa os dois. Rota que comeca com `/dossiery` ou
`/api/dossiery` NAO passa pelas regras da clinica.

## Integracoes Ativas

- **EXCALIBURGIT (canonico) e GitHub (mirror)** → `.brain/excaliburgit.md` (LEIA PRIMEIRO — explica por que push no GitHub nao chega em producao)
- **Variaveis de ambiente** → `.brain/env-vars.md` (31 variaveis, so os nomes, sem valor)
- **Dossiery: funil, produtos e precos** → `.brain/dossiery.md`

## Regra de seguranca deste brain

Este diretorio e **indice, nao cofre**. Nenhum token, senha, chave privada
ou cookie entra aqui. Segredo vive so no painel de variaveis do ambiente ou
no gerenciador de senhas.

Motivo: `.brain/` vai pro Git. Tudo que entrar aqui fica no historico pra
sempre, inclusive depois de apagado.

## Documentacao longa do Dossiery

Fora do `.brain/`, na raiz do repositorio:

- `DOSSIERY-LANCAMENTO.md` — checklist de go-live, 20 itens
- `DOSSIERY-PRECIFICACAO.md` — tabela de precos e degraus
- `DOSSIERY-ESTUDO-PRECIFICACAO.md` — unit economics, margem, CPL, CPA
- `Dossiery-Especificacao-do-Funil.pdf` — spec de 20 paginas pro programador
