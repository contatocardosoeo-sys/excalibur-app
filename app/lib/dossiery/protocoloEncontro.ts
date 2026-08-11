// ♠ Protocolo Encontro — o produto do upsell pós-compra.
// O Dossiery te leva até a mesa. Isto aqui é o que acontece NA mesa.
// Regra da casa: toda jogada vem com o PORQUÊ. Você adapta na sua voz e executa.
// t = a jogada · p = por que funciona

export interface JogadaEncontro {
  t: string
  p: string
}

export interface FaseEncontro {
  fase: string
  codinome: string
  objetivo: string
  jogadas: JogadaEncontro[]
}

export const PROTOCOLO_ENCONTRO: FaseEncontro[] = [
  {
    fase: 'Fase 1 · O Convite',
    codinome: 'FECHAR A DATA',
    objetivo:
      'Encontro marcado com dia, hora e lugar, sem o limbo do “bora sair qualquer dia” que nunca vira nada.',
    jogadas: [
      {
        t: 'Proposta fechada, sempre: “quinta, 20h, [bar X]. topa?”. Nunca “vamos sair um dia desses?”',
        p: '“Um dia desses” transfere o trabalho de decidir pra ela, e decisão pendente morre. Proposta fechada só pede um sim.',
      },
      {
        t: 'Se ela hesitar no dia, alternativa dupla: “quinta ou sábado, o que te salva?” Nunca “quando você pode?”',
        p: 'Duas opções mantêm você no comando do quadro e ainda dão a ela a sensação real de escolha. Pergunta aberta vira agenda infinita.',
      },
      {
        t: 'Convite ancorado no que ela disse: “você falou que ama [coisa]. conheço o lugar certo. quinta, 20h.”',
        p: 'Prova que você escuta. O encontro vira continuação natural da conversa em vez de um “pedido”.',
      },
      {
        t: 'Lugar: bar de balcão ou mesa pequena, meia-luz, a 5 min a pé de um segundo ponto. Nunca jantar formal no primeiro.',
        p: 'Jantar de frente é entrevista com talheres. Balcão aproxima os corpos, e o segundo ponto por perto deixa a “mudança de cenário” pronta (Fase 5).',
      },
      {
        t: '“Não sei se consigo…” sem contra-proposta dela → “tranquilo. quando sua agenda respirar, me avisa.” E some.',
        p: 'Quem remarca de verdade propõe outra data; quem só enrola, enrola. Sua resposta mostra abundância, e abundância é o que mais puxa de volta.',
      },
    ],
  },
  {
    fase: 'Fase 2 · A Véspera',
    codinome: 'ANTI-BOLO',
    objetivo: 'Chegar no dia com o encontro vivo e nunca mais ser o cara que descobre o bolo na porta do bar.',
    jogadas: [
      {
        t: 'Véspera, uma mensagem leve que AFIRMA: “amanhã 20h. já tô decidindo se conto ou não a história do [gancho].” Nada de “confirmado?”',
        p: '“Confirmado?” soa como quem espera o cancelamento. Afirmar o plano + abrir um loop de curiosidade dá a ela um motivo a mais pra ir.',
      },
      {
        t: 'Ela desmarcou COM nova data (“não consigo quinta, sábado pode?”) → um crédito: “sábado então. anotado.” Tom neutro, zero drama.',
        p: 'Remarcação espontânea é interesse real com agenda ruim: vale um crédito. O segundo bolo já é resposta, e a resposta é a Fase 1 com outra pessoa.',
      },
      {
        t: 'Desmarcou SEM nova data → “tranquilo.” E silêncio. Sem “que pena :(”, sem reagendar por ela.',
        p: 'Cobrança confirma que você não tem opção melhor. O silêncio de quem tem vida é a única resposta que sobe seu valor depois de um bolo.',
      },
      {
        t: 'No dia, você NÃO manda “tá de pé?”. Você se arruma e vai. Se der ruim, você toma uma no balcão e vai embora melhor que chegou.',
        p: 'Quem pergunta “tá de pé?” tá pedindo permissão pra levar bolo. Quem age como se o plano fosse óbvio transmite o frame de quem nunca é desmarcado.',
      },
    ],
  },
  {
    fase: 'Fase 3 · A Chegada',
    codinome: 'PRIMEIROS 10 MINUTOS',
    objetivo: 'Os 10 minutos que decidem o tom da noite inteira: território, postura e a primeira risada.',
    jogadas: [
      {
        t: 'Chegue 5 minutos antes. Escolha o lugar, peça sua bebida, esteja INSTALADO quando ela chegar.',
        p: 'Quem recebe está em casa; quem chega procurando mesa está visitando. O território é seu, ela entra no seu cenário.',
      },
      {
        t: 'Sente a 90° dela (quina do balcão/mesa). Nunca de frente, estilo entrevista.',
        p: 'Frente a frente é confronto ocular constante e distância fixa. A 90°, aproximar e afastar fica natural, e o toque casual (Fase 4) tem caminho.',
      },
      {
        t: 'Cumprimento: levanta, sorriso lento, um beijo no rosto com a mão firme no ombro dela. “Chegou a pessoa.” Nada de aceno sem sair da cadeira.',
        p: 'O primeiro toque quebra a barreira física no segundo zero, quando é mais fácil. E “chegou a pessoa” abre com energia de quem já é próximo.',
      },
      {
        t: 'Pedido sem novela: você já sabe o seu. “o [drink] daqui é covardia. vai de quê?” Decisão rápida, sem consultar o cardápio por 5 minutos.',
        p: 'Micro-decisões são micro-frames. Quem decide rápido no trivial é lido como quem decide rápido no que importa.',
      },
      {
        t: 'Primeira fala PROIBIDA: “e aí, chegou bem?” / “muito trânsito?”. Abra com observação do momento: “você chegou com cara de quem já tem uma história pra contar. desembucha.”',
        p: 'Small talk de elevador coloca a noite no trilho de conhecidos de trabalho. Uma provocação leve coloca no trilho de flerte, e trilho é difícil de trocar depois.',
      },
    ],
  },
  {
    fase: 'Fase 4 · A Conversa',
    codinome: 'O MEIO DO JOGO',
    objetivo: 'Sair do interrogatório e criar a sensação que ela vai lembrar: “com ele o papo flui”.',
    jogadas: [
      {
        t: 'Troque pergunta de RH por pergunta de história: em vez de “o que você faz?”, “qual foi a última vez que você fez algo pela primeira vez?”',
        p: 'Pergunta de ficha gera resposta de ficha, pergunta de história gera emoção. E a emoção fica associada a você.',
      },
      {
        t: 'Tenha UMA história sua preparada (2 min, com começo, tensão e autozoeira). Conte quando a conversa pedir, sem virar palestra.',
        p: 'Vulnerabilidade dosada + humor sobre si mesmo = confiança sem arrogância. História ensaiada é respeito pelo palco.',
      },
      {
        t: 'Provocação calibrada: implicância leve com algo que ela disse (“você TEM noção de que isso é red flag, né?” + sorriso). Nunca sobre corpo, família ou insegurança real.',
        p: 'Tease é o oposto do elogio em fila que ela recebe todo dia. Mostra que você não está em modo aprovação e gera a faísca do “repara em mim”.',
      },
      {
        t: 'Validação SELETIVA: quando ela contar algo que importa de verdade, larga a zoeira e olha nos olhos: “isso foi grande. sério.”',
        p: 'Quem provoca E reconhece tem amplitude. O elogio raro do cara que zoa vale dez do cara que concorda com tudo.',
      },
      {
        t: 'Toque calibrado: no pico da risada, mão no antebraço dela, 1-2 segundos, e SOLTA. Escalada por camadas, nunca mão parada.',
        p: 'Toque no pico emocional ancora a emoção em você, e soltar rápido mata qualquer cheiro de carência. Ela responde tocando de volta (sinal) ou não (informação).',
      },
      {
        t: 'Placar de sinais. VERDE: ela toca você, aproxima o corpo, pergunta de você, mexe no cabelo olhando. VERMELHO: resposta curta, corpo pra saída, celular na mão. Verde → escala. Vermelho → volta um passo e reconquista o papo leve.',
        p: 'O jogo não é decoreba, é leitura: escalar no vermelho é o erro nº1 do Modo Trouxa, ignorar o verde é o nº2. Ler e responder É o carisma.',
      },
      {
        t: 'Proibidos da mesa: falar de ex, reclamar do trabalho, celular virado pra cima, beber mais rápido que ela.',
        p: 'Cada um desses puxa a energia pra baixo ou pra fora. A mesa é palco de presença: quem está inteiro ali é raro, e raro é atraente.',
      },
    ],
  },
  {
    fase: 'Fase 5 · A Condução',
    codinome: 'ESCALADA',
    objetivo: 'Transformar papo bom em tensão boa: mudança de cenário, proximidade e o beijo sem pedir e sem atropelar.',
    jogadas: [
      {
        t: 'Na primeira queda natural de energia (60-90 min), mude o cenário: “aqui cumpriu a missão. vem, próximo lugar é melhor.” Levanta primeiro.',
        p: 'Dois lugares numa noite = na memória dela, parecem dois encontros. E seguir você no deslocamento cria o hábito de te acompanhar.',
      },
      {
        t: 'No trajeto a pé: você do lado da rua, mão nas costas dela por 2 segundos ao atravessar. Curto, firme, e solta.',
        p: 'Proteção sem discurso: o corpo entende antes da cabeça. O toque de condução é o degrau entre o antebraço e o beijo.',
      },
      {
        t: 'A janela do beijo: conversa desacelera, ela sustenta o olhar, distância já é curta. Aproxima 90% devagar… e espera os 10% dela.',
        p: 'Os 90% comunicam intenção sem palavra. Os 10% são a resposta dela: quando ela cruza, o beijo é dos dois.',
      },
      {
        t: 'Ela não veio nos 10% ou virou o rosto? Sorri, volta pro papo como se nada, segue a noite. Zero cara de derrota, zero “desculpa”.',
        p: 'Recuo é timing, e como você reage AO recuo é o teste real. Quem segue leve e inteiro mantém a porta aberta; quem murcha, fecha.',
      },
      {
        t: 'NUNCA: “posso te beijar?” em tom de súplica, beijo roubado sem janela, ou insistir depois de um recuo.',
        p: 'Pedir com medo entrega o frame; atropelar sinal destrói tudo, inclusive você. O jogo de quem lê é o único que ganha DE VERDADE.',
      },
    ],
  },
  {
    fase: 'Fase 6 · O Fechamento',
    codinome: 'FIM NO PICO',
    objetivo: 'Encerrar a noite no ponto mais alto, porque o final é o que a memória dela guarda.',
    jogadas: [
      {
        t: 'VOCÊ encerra, no pico: “vou te deixar ir antes que você se apaixone de vez.” Nunca deixe a noite morrer de tédio até alguém bocejar.',
        p: 'Peak-end: a memória de um evento é o pico + o final. Fim no auge = noite inteira lembrada como auge; fim arrastado = arrastado.',
      },
      {
        t: 'A conta: você convidou, você paga. Sem discurso de “relaxa, eu faço questão”, sem olhar esperando medalha.',
        p: 'Pagar com naturalidade é frame de anfitrião. Transformar em cena é cobrar crédito, e crédito cobrado vira dívida.',
      },
      {
        t: 'Despedida com semente: “da próxima, [plano específico ligado a algo que ELA disse]. já tô decidindo o dia.” Afirmação, não pergunta.',
        p: 'Projeta futuro concreto sem pedir compromisso agora. Ela vai embora com a “parte 2” já rodando na cabeça.',
      },
      {
        t: 'Saiu, acabou: nada de “já cheguei, e você?” + relatório da noite às 23h47. O silêncio pós-pico trabalha pra você.',
        p: 'A ausência imediata deixa a experiência ecoar. Quem preenche todo silêncio com carência apaga o próprio pico.',
      },
    ],
  },
  {
    fase: 'Fase 7 · Pós-Jogo',
    codinome: 'D+1',
    objetivo: 'A mensagem do dia seguinte e a ponte pro segundo encontro, sem virar o cara que sufoca depois de UMA noite boa.',
    jogadas: [
      {
        t: 'D+1, entre 11h e 14h, callback de piada interna: “acabei de ver [coisa da noite] e lembrei da sua tese ridícula. segue errada.” NUNCA “bom dia, chegou bem?”',
        p: 'O callback reativa a emoção da noite em uma linha; “chegou bem?” reativa um protocolo de tia. Você quer o riso dela de novo.',
      },
      {
        t: 'Cadência: espelha o ritmo dela e puxa 10%. Nunca 3 mensagens pra cada 1, nunca online 24/7 de prontidão.',
        p: 'Depois de um encontro bom, o desespero é o único jeito de estragar. Espelho+10% mantém tração sem sufocar o espaço onde a saudade nasce.',
      },
      {
        t: 'Segundo encontro proposto em cima do que ELA deu: “você disse que nunca [coisa]. inaceitável. sábado eu resolvo isso.” Fase 1 de novo, mais quente.',
        p: 'Usar o material dela prova presença e dá ao segundo encontro um propósito: não é “sair de novo”, é uma missão dos dois.',
      },
      {
        t: 'Esfriou depois de dias? Uma reativação do Kit (grupo “Reativar”), uma vez. Sem resposta real → energia pra próxima. O Protocolo roda de novo: você agora é outro cara.',
        p: 'Insistir em porta fechada é devolver o frame que você construiu. O maior sinal de valor é ter pra onde ir, e agora você tem o mapa inteiro.',
      },
    ],
  },
]

export const TOTAL_JOGADAS = PROTOCOLO_ENCONTRO.reduce((n, f) => n + f.jogadas.length, 0)
