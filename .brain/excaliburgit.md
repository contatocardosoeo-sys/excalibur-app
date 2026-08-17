# EXCALIBURGIT e GitHub — topologia deste repositorio

**REGRA DE OURO** (decisao CEO Cardoso 2026-06-02, documentada em
`excalibur-hq/.brain/excaliburgit.md`):

> **EXCALIBURGIT e o repositorio CANONICO.**
> **GitHub e BACKUP/MIRROR — nao e fonte de verdade.**

## O problema especifico deste repositorio

O `excalibur-hq` tem **dual push** configurado: um `git push origin` envia
para EXCALIBURGIT e para o GitHub ao mesmo tempo.

**O `excalibur-app` NAO tem.** Estado atual do remote:

```
origin  https://github.com/contatocardosoeo-sys/excalibur-app.git  (fetch)
origin  https://github.com/contatocardosoeo-sys/excalibur-app.git  (push)
```

So GitHub. Nao existe remote de EXCALIBURGIT aqui.

### Consequencia direta

Producao (`dossiery.com.br`, servida por nginx em `200.187.72.153`) puxa do
EXCALIBURGIT. Commit empurrado pro GitHub **nao chega no ar**. Nao e falha de
deploy nem alteracao manual de ninguem: e a topologia funcionando como foi
desenhada, com este repositorio fora dela.

`200.187.72.153` e o mesmo IP de `git.plataformaexcalibur.com.br`. Servidor de
git e servidor de producao sao a mesma maquina.

## Correcao — rodar na maquina que alcanca o EXCALIBURGIT

O agente na nuvem NAO alcanca `git.plataformaexcalibur.com.br` (politica de
egress do ambiente bloqueia o host, 403 no CONNECT). Estes comandos precisam
rodar na maquina do Matheus, no Codex ou no servidor.

Credenciais: pegar no gerenciador de senhas. Nao colar token em comando que
vai pro historico do shell nem em arquivo versionado.

```bash
# 1. Confirmar o nome do repo no EXCALIBURGIT antes de qualquer coisa
#    (a UI fica em https://git.plataformaexcalibur.com.br/excalibur)

# 2. Remote separado, pra operacao direta
git remote add excaliburgit https://git.plataformaexcalibur.com.br/excalibur/excalibur-app.git

# 3. Dual push no origin.
#    ATENCAO: set-url --add --push SUBSTITUI a URL default de push.
#    As DUAS precisam ser declaradas, senao perde um dos destinos.
git remote set-url --delete --push origin '.*'
git remote set-url --add --push origin https://github.com/contatocardosoeo-sys/excalibur-app.git
git remote set-url --add --push origin https://git.plataformaexcalibur.com.br/excalibur/excalibur-app.git

# 4. Espelhar tudo que ja existe no GitHub e falta no EXCALIBURGIT
git push excaliburgit --all
git push excaliburgit --tags
```

A branch de trabalho do Dossiery e `claude/dossiery-conquista-platform-cirfjf`.

Depois disso, `git push origin <branch>` mostra a saida **2x**, uma por
destino. Isso e esperado.

## Quando os dois divergem

1. **EXCALIBURGIT vence** — e o canonico
2. Se o GitHub tem commits uteis que faltam la, leva pro EXCALIBURGIT primeiro
   e depois alinha o GitHub
3. Se o EXCALIBURGIT esta certo e o GitHub divergiu, force-push do
   EXCALIBURGIT pro GitHub

Validar alinhamento:

```bash
git fetch --all
for b in main claude/dossiery-conquista-platform-cirfjf; do
  echo "$b: GH=$(git rev-parse --short origin/$b) EXCAL=$(git rev-parse --short excaliburgit/$b)"
done
```

## Limitacoes conhecidas

1. **PR nao replica** entre GitHub e EXCALIBURGIT. PR e conceito do servidor.
   Abrir manualmente, preferir EXCALIBURGIT.
2. **Hook de prod pode dar `git reset --hard`** se houver commit local sem
   push. Mitigacao: push imediato depois do commit.
3. **GitHub Actions que auto-mergeia** nao dispara push pro EXCALIBURGIT.
   Solucao definitiva seria webhook GitHub -> mirror, nao configurado.

## Quem alcanca o que

| Superficie | EXCALIBURGIT | GitHub | Supabase / Stripe / Vercel |
|---|---|---|---|
| Claude Code na nuvem | Nao (403) | Sim | Nao (403) |
| Codex / maquina do Matheus | Sim | Sim | Sim |
| Servidor de producao | Sim | Sim | Sim |

O ambiente do Claude Code na nuvem so libera GitHub e a API da Anthropic.
Verificado em 17/08/2026. Para mudar, o host precisa entrar na allowlist de
egress do ambiente: https://code.claude.com/docs/en/claude-code-on-the-web
