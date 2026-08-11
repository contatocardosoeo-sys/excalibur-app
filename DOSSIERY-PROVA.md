# ♠ DOSSIERY — Máquina de prova social REAL (30 dias)

> Depoimento fabricado é publicidade enganosa (CDC art. 37, CONAR), derruba conta
> de anúncio na Meta e vira chargeback. Este documento é o caminho que produz
> prova de verdade em 30 dias, com autorização em mãos, custando R$0.
>
> Código: `app/lib/dossiery/provas.ts` (array vazio por padrão, não renderiza nada
> sem autorização). Preencha só com o que você colheu de gente real.

---

## A conta que justifica o esforço

Sem prova, tráfego frio a R$497+ não fecha: o cético não tem em que se apoiar.
Com 8 a 12 depoimentos concretos, a mesma copy costuma sustentar CPA bem menor
(estimado). Trinta dias de coleta valem mais que qualquer teste de headline.

## Semana 1: recrutar 20 fundadores beta

**Onde:** seu WhatsApp, seu Instagram, grupos onde você já é conhecido. NÃO
compre tráfego para isso. Você quer gente que responde, não volume.

**A mensagem (mande no privado, um a um, nunca em lista):**

> Tô abrindo 20 vagas de teste do Dossiery antes de lançar. É uma IA que lê as
> suas conversas e mostra onde você entrega o jogo, e te treina até parar.
>
> Acesso completo, de graça, pra sempre. Em troca eu quero três coisas: você
> usar por 30 dias de verdade, me mandar print do antes e do depois (nome e
> rosto dela borrados), e um áudio de 40 segundos no fim contando o que mudou.
>
> Se topar, te libero hoje. Se não rolar pra você, sem problema, só me avisa.

**Filtro:** só entra quem responde em 24h. Quem enrola no recrutamento não
executa depois, e depoimento morno não vale a vaga.

## Semana 1 a 4: o acompanhamento que garante resultado

O erro clássico é liberar acesso e sumir. Sem acompanhamento, 15 dos 20 não
executam e você fica sem prova.

| Dia | O que você faz |
|---|---|
| D0 | Libera acesso, pede o print do estado atual (a conversa parada) |
| D2 | "Fez a missão do D1? Manda o print da faxina do perfil" |
| D7 | Cobra o debrief do Plano 7 Dias. Quem sumiu, sai da lista |
| D14 | Pede o primeiro resultado, mesmo pequeno: uma resposta que voltou |
| D21 | Pergunta se já marcou algo. Se não, ajuda de graça: você quer o caso |
| D30 | Colhe: print antes/depois, áudio de 40s, e a autorização assinada |

## O que colher (e o que NÃO serve)

**Serve:**
- Print da conversa antes (mensagem parada, vácuo) e depois (resposta, encontro marcado)
- Áudio ou vídeo de 40 a 60 segundos, na voz dele, sem roteiro seu
- Uma frase verbatim que ele mesmo escreveu no WhatsApp
- Fato verificável: "marquei 2 encontros em 3 semanas", "ela respondeu em 4 minutos"

**Não serve:**
- "Muito bom, recomendo" (elogio genérico não move ninguém)
- Número que ele não consegue provar
- Nada que envolva identificar a mulher: rosto, nome, @ e foto sempre borrados

## A autorização (sem isso, não publica)

Mande por WhatsApp e guarde o print da resposta:

> Posso publicar seu depoimento e os prints (com o nome e o rosto dela borrados)
> no site e nos anúncios do Dossiery? Vou usar só seu primeiro nome e a inicial
> do sobrenome, mais idade e cidade. Você pode pedir pra tirar do ar quando
> quiser, é só me mandar mensagem. Responde "autorizo" que eu guardo aqui.

Arquive cada "autorizo" numa pasta. Se um dia o CONAR, o Procon ou a Meta
perguntarem, você tem.

## Como publicar sem virar enganoso

1. Preencha `PROVAS` em `app/lib/dossiery/provas.ts`, um por um, com
   `autorizado: true` só depois de ter o print da autorização.
2. Salve os prints em `public/dossiery/provas/`, já borrados.
3. Disclaimer obrigatório perto do bloco de depoimentos: **"Resultados
   individuais. Não há garantia de resultado igual."** Isso não é frescura
   jurídica: é o que separa prova de promessa.
4. Nunca edite a fala. Cortar é permitido, reescrever não.
5. Rotacione: prova de mais de 12 meses perde força e levanta suspeita.

## As três provas que você já tem hoje (use enquanto colhe)

Enquanto os 30 dias correm, você não está sem nada:

1. **Demonstração ao vivo.** O Raio-X funciona. Grave sua tela analisando uma
   conversa real (a sua) e mostre o diagnóstico saindo. Demonstração é a prova
   mais forte que existe para produto de software, e não depende de cliente.
2. **Procedência do método.** Você destilou um cânone de atração e psicologia.
   Nomeie as fontes na página. Autoridade emprestada é prova legítima.
3. **Risco invertido.** A garantia em dobro (`/dossiery/garantia`) é prova de
   confiança: ninguém oferece devolver o dobro de um produto que não entrega.

E as conversas simuladas do site continuam rotuladas "ilustrativas do método".
Mantenha o rótulo. Ele custa alguns pontos de conversão e compra sua conta de
anúncio de volta toda vez que a Meta revisar.

---

## Checklist antes de publicar qualquer prova

- [ ] Autorização por escrito arquivada
- [ ] Rosto, nome e @ dela borrados em todo print
- [ ] Nada de número que o cliente não consiga comprovar
- [ ] Disclaimer de resultados individuais visível no bloco
- [ ] `autorizado: true` só depois dos itens acima
