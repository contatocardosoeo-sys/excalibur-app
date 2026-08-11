// ♠ Raio-X — o quiz gamificado do topo do funil.
// 10 cenários reais → Índice Modo Trouxa (0-100) + arquétipo dominante.
// Scoring honesto: cada opção tem peso real; nada de resultado inventado.
//
// Arquétipos do Modo Trouxa:
//   B = O Bombeiro       — apaga todo vácuo dela com mais atenção
//   E = O Entrevistador  — transforma flerte em entrevista de emprego
//   F = O Fã             — elogia, valida, aplaude; vira plateia
//   G = O Fantasma       — some na hora H; não marca, não avança
//   P = O Estrategista Paralisado — analisa tudo, não manda nada
//   O = Operador em formação (score baixo)

export type Arq = 'B' | 'E' | 'F' | 'G' | 'P'

export interface OpcaoRaioX {
  t: string
  pts: number // 0-3 (0 = jogada de Operador)
  arq: Arq | null
}

export interface PerguntaRaioX {
  q: string
  opcoes: OpcaoRaioX[]
}

export const PERGUNTAS: PerguntaRaioX[] = [
  {
    q: 'Ela visualizou faz 2 horas. Nada.',
    opcoes: [
      { t: 'Mando um "?" ou "tá aí?"', pts: 3, arq: 'B' },
      { t: 'Mando outra explicando a primeira', pts: 2, arq: 'B' },
      { t: 'Sigo meu dia. Se voltar, volto por outro ângulo', pts: 0, arq: null },
      { t: 'Não mando nada, mas olho o celular toda hora', pts: 2, arq: 'P' },
    ],
  },
  {
    q: 'Match novo. Primeira mensagem.',
    opcoes: [
      { t: '"Oi, tudo bem?", educado nunca errou', pts: 2, arq: 'E' },
      { t: 'Elogio caprichado na beleza dela', pts: 3, arq: 'F' },
      { t: 'Pego um detalhe do perfil e provoco de leve', pts: 0, arq: null },
      { t: 'Nenhuma. Fico 20 minutos pensando e desisto', pts: 3, arq: 'P' },
    ],
  },
  {
    q: 'A conversa esfriou. Só "kkk" e "sim".',
    opcoes: [
      { t: 'Pergunto mais do dia dela, vai que abre', pts: 3, arq: 'E' },
      { t: 'Pergunto se fiz algo errado', pts: 3, arq: 'B' },
      { t: 'Seco também, na passivo-agressiva', pts: 2, arq: 'G' },
      { t: 'Corto o papo morno e jogo uma provocação', pts: 0, arq: null },
    ],
  },
  {
    q: 'Ela posta story com um cara que você não conhece.',
    opcoes: [
      { t: 'Pergunto quem é, de leve, "só curiosidade"', pts: 3, arq: 'B' },
      { t: 'Curto o story pra marcar presença', pts: 2, arq: 'F' },
      { t: 'Esfrio sem explicar e fico remoendo', pts: 2, arq: 'G' },
      { t: 'Não é problema meu. Sigo o jogo', pts: 0, arq: null },
    ],
  },
  {
    q: 'Hora de chamar pra sair.',
    opcoes: [
      { t: '"A gente devia sair qualquer dia desses"', pts: 2, arq: 'G' },
      { t: 'Espero ELA sugerir, não quero pressionar', pts: 3, arq: 'G' },
      { t: 'Dia, hora e lugar. Direto', pts: 0, arq: null },
      { t: 'Tô montando o convite perfeito faz 2 semanas', pts: 3, arq: 'P' },
    ],
  },
  {
    q: '"Você é incrível, mas te vejo como amigo."',
    opcoes: [
      { t: 'Aceito. Perto é melhor que longe', pts: 3, arq: 'F' },
      { t: 'Dobro a atenção pra provar que sou diferente', pts: 3, arq: 'B' },
      { t: '"Tranquilo, amiga eu já tenho." E me afasto de verdade', pts: 0, arq: null },
      { t: 'Sumo magoado, sem dizer nada', pts: 2, arq: 'G' },
    ],
  },
  {
    q: 'Sábado, 19h40. "Não vou conseguir ir 🥺"',
    opcoes: [
      { t: '"Poxa :( tudo bem! Remarcamos?"', pts: 3, arq: 'F' },
      { t: 'Cobro na hora: "sério que você tá fazendo isso?"', pts: 2, arq: 'B' },
      { t: '"Tranquilo." Minha agenda decide se tem próxima', pts: 0, arq: null },
      { t: 'Nunca mais falo, mas fico semanas ruminando', pts: 2, arq: 'G' },
    ],
  },
  {
    q: 'Você tem uma mensagem importante pra mandar.',
    opcoes: [
      { t: 'Releio 5 vezes, apago 3, mando print pro grupo', pts: 3, arq: 'P' },
      { t: 'Mando o que vier, na hora', pts: 2, arq: 'B' },
      { t: 'Reviso o gancho uma vez e mando', pts: 0, arq: null },
      { t: 'Escrevo tudo e morre no rascunho', pts: 3, arq: 'P' },
    ],
  },
  {
    q: 'Elogios. Seu padrão.',
    opcoes: [
      { t: 'Elogio em quase toda mensagem', pts: 3, arq: 'F' },
      { t: 'Nunca elogio, pra não parecer interessado', pts: 2, arq: 'G' },
      { t: 'Raro e específico: quando ela ganha um, vale', pts: 0, arq: null },
      { t: 'Comento "linda 😍" quando ela posta foto', pts: 3, arq: 'F' },
    ],
  },
  {
    q: 'No encontro, chega a hora do beijo.',
    opcoes: [
      { t: 'Espero um sinal 100% claro, que nunca vem', pts: 3, arq: 'G' },
      { t: 'Pergunto "posso te beijar?" quase pedindo desculpa', pts: 2, arq: 'F' },
      { t: 'Travo na minha cabeça e a janela passa', pts: 3, arq: 'P' },
      { t: 'Leio o momento, aproximo 90% e espero os 10% dela', pts: 0, arq: null },
    ],
  },
]

export const MAX_PTS = PERGUNTAS.reduce((n, p) => n + Math.max(...p.opcoes.map((o) => o.pts)), 0)

export interface ResultadoRaioX {
  nome: string
  tag: string
  diagnostico: string
  custo: string
  correcoes: string[]
}

export const RESULTADOS: Record<Arq | 'O', ResultadoRaioX> = {
  B: {
    nome: 'O Bombeiro',
    tag: 'apaga vácuo com atenção',
    diagnostico:
      'Todo silêncio dela vira emergência. Você responde em segundos e manda o "?" quando ela some. Sua atenção tá de graça, e ela sabe.',
    custo:
      'Ela nunca sente sua falta porque falta nunca existiu. Você responde pelos dois.',
    correcoes: [
      'Nunca mande duas mensagens seguidas sem resposta dela. Nunca.',
      'Espelhe o ritmo dela e puxe só 10% a mais.',
      'Vácuo não se cobra. Quando voltar, chegue com assunto novo e zero menção ao sumiço.',
    ],
  },
  E: {
    nome: 'O Entrevistador',
    tag: 'flerte com cara de RH',
    diagnostico:
      'Seu flerte parece entrevista. "O que você faz? Gosta de viajar?" Ela responde por educação enquanto o interesse morre.',
    custo:
      'Você vira o contato que ela responde no intervalo e esquece.',
    correcoes: [
      'Troque pergunta de RH por história: "qual foi a última vez que…?"',
      'Afirme mais, pergunte menos: "aposto que você é do tipo que…"',
      'A cada pergunta, entregue algo seu junto.',
    ],
  },
  F: {
    nome: 'O Fã',
    tag: 'plateia não beija o palco',
    diagnostico:
      'Você elogia tudo e concorda com tudo. Ela já tem mil fãs no direct, você virou só mais um. Fã dá conforto, e conforto vira amizade.',
    custo:
      'Você vira o "fofo" que ela mostra pras amigas enquanto sai com o cara que a desafia.',
    correcoes: [
      'Corte 90% dos elogios: só o raro e específico vale.',
      'Solte uma provocação leve por conversa, implicância gera faísca.',
      'Discorde quando discordar. Opinião própria vale mais que "verdade, total".',
    ],
  },
  G: {
    nome: 'O Fantasma',
    tag: 'some na hora H',
    diagnostico:
      'Você joga bonito até a hora de avançar. Na hora de marcar ou beijar, trava esperando um sinal que nunca vem. Depois passa a semana no replay.',
    custo:
      'Ela lê seu medo como desinteresse e parte pra quem age. Cara pior que você leva só porque tentou.',
    correcoes: [
      'Convide com dia, hora e lugar. "Qualquer dia" mata o encontro.',
      'No beijo, avance 90% devagar e deixe os 10% finais com ela.',
      'Abriu janela, aja no mesmo dia.',
    ],
  },
  P: {
    nome: 'O Estrategista Paralisado',
    tag: 'sabe tudo, não manda nada',
    diagnostico:
      'Você monta a mensagem perfeita e deixa no rascunho. Seu jogo rola só na sua cabeça, onde ninguém te rejeita. Nem te beija.',
    custo:
      'Enquanto você lapida a jogada, um cara com metade do seu repertório manda um "oi" torto e marca o encontro.',
    correcoes: [
      'Revise UMA vez e mande. Passou de 5 minutos: manda ou apaga.',
      'Trate erro como dado: mensagem que falhou ensina mais que 3 horas de análise.',
      'Nada de print pro grupo antes de agir. Debrief só depois do jogo.',
    ],
  },
  O: {
    nome: 'Operador em formação',
    tag: 'base sólida, teto alto',
    diagnostico:
      'Você joga acima da média: propõe encontro direto e não implora atenção. Só que a média é o Modo Trouxa. Ainda tem muito na mesa, principalmente sob pressão.',
    custo:
      'Seu risco agora se chama platô. Sem feedback bom, os 20% que faltam ficam invisíveis pra você mesmo.',
    correcoes: [
      'Anote o que funciona: acerto sem registro não se repete sob pressão.',
      'Treine o cenário difícil antes de rolar: bolo, teste, recuo.',
      'Faça análise fria das SUAS conversas reais. O próximo nível sai daí.',
    ],
  },
}

// Índice + arquétipo dominante a partir dos índices das opções escolhidas.
export function calcularResultado(respostas: number[]): { arq: Arq | 'O'; score: number } {
  let pts = 0
  const contagem: Record<Arq, number> = { B: 0, E: 0, F: 0, G: 0, P: 0 }

  respostas.forEach((opIdx, i) => {
    const op = PERGUNTAS[i]?.opcoes[opIdx]
    if (!op) return
    pts += op.pts
    if (op.arq) contagem[op.arq] += op.pts
  })

  const score = Math.round((pts / MAX_PTS) * 100)
  if (score < 20) return { arq: 'O', score }

  const dominante = (Object.keys(contagem) as Arq[]).reduce((a, b) =>
    contagem[b] > contagem[a] ? b : a
  )
  return { arq: dominante, score }
}
