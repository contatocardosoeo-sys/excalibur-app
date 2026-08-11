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
    q: 'Ela visualizou sua mensagem há 2 horas. Nada de resposta. Você…',
    opcoes: [
      { t: 'Mando um "?" ou "tá aí?"', pts: 3, arq: 'B' },
      { t: 'Mando outra mensagem explicando melhor a primeira', pts: 2, arq: 'B' },
      { t: 'Sigo meu dia. Se voltar, volto por outro ângulo', pts: 0, arq: null },
      { t: 'Não mando nada, mas checo o celular a cada 5 minutos', pts: 2, arq: 'P' },
    ],
  },
  {
    q: 'Match novo. A primeira mensagem que você manda é…',
    opcoes: [
      { t: '"Oi, tudo bem?" — educado nunca errou', pts: 2, arq: 'E' },
      { t: 'Um elogio caprichado na beleza dela', pts: 3, arq: 'F' },
      { t: 'Uma observação específica do perfil com provocação leve', pts: 0, arq: null },
      { t: 'Nenhuma. Fico 20 minutos pensando e desisto', pts: 3, arq: 'P' },
    ],
  },
  {
    q: 'A conversa esfriou: respostas secas, "kkk", "sim". Você…',
    opcoes: [
      { t: 'Faço mais perguntas sobre o dia dela — quem sabe abre', pts: 3, arq: 'E' },
      { t: 'Pergunto se fiz algo errado', pts: 3, arq: 'B' },
      { t: 'Seco também, na passivo-agressiva', pts: 2, arq: 'G' },
      { t: 'Corto o papo morno e mudo o jogo com uma provocação', pts: 0, arq: null },
    ],
  },
  {
    q: 'Ela posta story com um cara que você não conhece. Você…',
    opcoes: [
      { t: 'Pergunto quem é, de leve, "só curiosidade"', pts: 3, arq: 'B' },
      { t: 'Curto o story pra marcar presença', pts: 2, arq: 'F' },
      { t: 'Esfrio sem explicar e fico remoendo', pts: 2, arq: 'G' },
      { t: 'Story dela não é problema meu. Meu jogo continua', pts: 0, arq: null },
    ],
  },
  {
    q: 'Chegou a hora de chamar pro encontro. Seu movimento…',
    opcoes: [
      { t: '"A gente devia sair qualquer dia desses"', pts: 2, arq: 'G' },
      { t: 'Espero ELA sugerir — não quero pressionar', pts: 3, arq: 'G' },
      { t: 'Dia, hora e lugar. Direto', pts: 0, arq: null },
      { t: 'Planejo o convite perfeito há 2 semanas. Ainda não mandei', pts: 3, arq: 'P' },
    ],
  },
  {
    q: '"Você é incrível, mas te vejo como amigo." Sua resposta…',
    opcoes: [
      { t: 'Aceito. Perto é melhor que longe', pts: 3, arq: 'F' },
      { t: 'Dobro a atenção pra provar que sou diferente', pts: 3, arq: 'B' },
      { t: '"Tranquilo — amiga eu já tenho." E abro espaço de verdade', pts: 0, arq: null },
      { t: 'Sumo magoado, sem dizer nada', pts: 2, arq: 'G' },
    ],
  },
  {
    q: 'Sábado, 19h40. "Amiga, não vou conseguir ir 🥺" Você…',
    opcoes: [
      { t: '"Poxa :( tudo bem! Remarcamos?"', pts: 3, arq: 'F' },
      { t: 'Cobro na hora: "sério que você tá fazendo isso?"', pts: 2, arq: 'B' },
      { t: '"Tranquilo." E a minha agenda decide se existe próxima', pts: 0, arq: null },
      { t: 'Nunca mais falo — mas passo semanas ruminando', pts: 2, arq: 'G' },
    ],
  },
  {
    q: 'Antes de mandar qualquer mensagem importante, você…',
    opcoes: [
      { t: 'Releio 5 vezes, apago 3, mando print pro grupo', pts: 3, arq: 'P' },
      { t: 'Mando o que vier, na hora — sempre respondo em segundos', pts: 2, arq: 'B' },
      { t: 'Reviso o gancho uma vez e mando', pts: 0, arq: null },
      { t: 'Escrevo… e deixo no rascunho pra sempre', pts: 3, arq: 'P' },
    ],
  },
  {
    q: 'Sobre elogiar, seu padrão é…',
    opcoes: [
      { t: 'Elogio em quase toda mensagem — gentileza gera gentileza', pts: 3, arq: 'F' },
      { t: 'Nunca elogio, pra não parecer interessado', pts: 2, arq: 'G' },
      { t: 'Raro e específico — quando ela ganha um, vale', pts: 0, arq: null },
      { t: 'Comento "linda 😍" quando ela posta foto', pts: 3, arq: 'F' },
    ],
  },
  {
    q: 'No encontro, chega A hora do beijo. Você…',
    opcoes: [
      { t: 'Espero um sinal 100% inequívoco (que nunca vem)', pts: 3, arq: 'G' },
      { t: 'Pergunto "posso te beijar?" com voz de quem pede desculpa', pts: 2, arq: 'F' },
      { t: 'Fico tão na minha cabeça que a janela passa', pts: 3, arq: 'P' },
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
      'Todo silêncio dela dispara seu alarme. Você responde em segundos, manda a segunda mensagem, o "?", o áudio explicando. Cada incêndio que você corre pra apagar diz a mesma coisa: "minha atenção não vale nada — é grátis e infinita."',
    custo:
      'Ela nunca sente sua falta, porque você nunca deu espaço pra falta existir. O vácuo vira rotina: por que ela responderia rápido, se você responde por dois?',
    correcoes: [
      'Regra das 2 mensagens: nunca duas suas em sequência sem resposta dela. NUNCA.',
      'Espelho + 10%: responda no ritmo dela, puxando só um pouco mais — não no seu desespero.',
      'Vácuo não se cobra, se ignora: quando voltar a falar, volte por um ângulo NOVO, sem tocar no sumiço.',
    ],
  },
  E: {
    nome: 'O Entrevistador',
    tag: 'flerte com cara de RH',
    diagnostico:
      'Você não conversa — aplica questionário. "E aí, o que você faz? Gosta de viajar? Praia ou campo?" Ela responde por educação enquanto o interesse morre. Pergunta atrás de pergunta, zero tensão, zero jogo.',
    custo:
      'Você vira o contato que ela responde no intervalo — e esquece. Interrogatório gera ficha cadastral, não vontade de te ver.',
    correcoes: [
      'Troque pergunta de RH por pergunta de história: "qual foi a última vez que você…?"',
      'Afirme mais, pergunte menos: leitura fria ("aposto que você é do tipo que…") puxa mais resposta que questionário.',
      'A cada pergunta que fizer, entregue algo seu junto — conversa é troca, não triagem.',
    ],
  },
  F: {
    nome: 'O Fã',
    tag: 'plateia não beija o palco',
    diagnostico:
      'Você elogia, valida, aplaude, concorda. "Linda", "perfeita", "merece o mundo". Acha que admiração compra atração — mas ela já tem mil fãs no direct. Fã não gera tensão. Fã gera conforto. E conforto, sozinho, vira amizade.',
    custo:
      'Você vira o "fofo" que ela mostra pras amigas — enquanto sai com o cara que a desafia. A fila de fãs anda, mas nunca chega ao caixa.',
    correcoes: [
      'Corte 90% dos elogios: raro e específico — elogio tem que ser conquistado, não distribuído.',
      'Uma provocação leve por conversa: implicância calibrada gera a faísca que elogio nunca gerou.',
      'Discorde quando discordar. Ter opinião própria vale mais que mil "verdade, total".',
    ],
  },
  G: {
    nome: 'O Fantasma',
    tag: 'some na hora H',
    diagnostico:
      'Você joga bonito até a hora de avançar — aí trava. Não marca, não confirma, não beija, espera "sinal claro" que nunca vem. Cada janela que abre, você observa… até fechar. Depois passa semanas no replay mental.',
    custo:
      'Ela interpreta seu medo como desinteresse — e dá o interesse dela pra quem AGE. Você não perde para caras melhores. Perde para caras que tentam.',
    correcoes: [
      'Proposta fechada sempre: dia + hora + lugar. "Qualquer dia" é onde encontros vão pra morrer.',
      'Regra dos 90%: no momento do beijo, aproxime devagar — os 10% finais são dela. Recuo não é rejeição, é timing.',
      'Uma janela aberta = uma ação no MESMO dia. Coragem com prazo deixa de ser abstrata.',
    ],
  },
  P: {
    nome: 'O Estrategista Paralisado',
    tag: 'sabe tudo, não manda nada',
    diagnostico:
      'Você estuda, analisa, monta a mensagem perfeita — e não manda. Relê 5 vezes, apaga 3, pede opinião no grupo, deixa no rascunho. Seu jogo acontece inteiro dentro da sua cabeça, onde ninguém pode te rejeitar. Nem te beijar.',
    custo:
      'Enquanto você lapida a jogada perfeita, um cara com metade do seu repertório manda um "oi" torto — e marca o encontro. Perfeição parada perde de execução imperfeita. Sempre.',
    correcoes: [
      'Regra dos 5 minutos: pensou a mensagem? Revisa UMA vez e manda. Rascunho de mais de 5 minutos = enviar ou apagar.',
      'Errar é dado, não derrota: mensagem que "falhou" te ensina mais que 3 horas de análise.',
      'Proibido print pro grupo ANTES de agir. Debrief é depois do jogo — não no lugar dele.',
    ],
  },
  O: {
    nome: 'Operador em formação',
    tag: 'base sólida, teto alto',
    diagnostico:
      'Você já joga acima da média: não implora atenção, propõe encontro direto, lê sinais. Mas "acima da média" num jogo onde a média é o Modo Trouxa ainda deixa MUITO na mesa — consistência sob pressão é outra conversa.',
    custo:
      'Seu risco não é o vácuo — é o platô. Sem feedback de elite, os 20% que faltam (calibragem fina, escalada, condução) ficam invisíveis pra você mesmo.',
    correcoes: [
      'Grave seus padrões: o que funciona por acaso não se repete sob pressão. Sistema, não sorte.',
      'Treine o cenário raro ANTES de acontecer: bolo, teste, recuo — quem só treina o fácil trava no difícil.',
      'Busque teto, não plateia: seu próximo nível vem de análise fria das SUAS conversas reais.',
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
