// ♠ Kit 50 Aberturas Que Não Morrem — o produto do order bump.
// Regra da casa: toda linha vem com o PORQUÊ. Você adapta na sua voz e manda.
// t = a mensagem · p = por que funciona

export interface Abertura {
  t: string
  p: string
}

export interface GrupoAberturas {
  grupo: string
  desc: string
  itens: Abertura[]
}

export const KIT_ABERTURAS: GrupoAberturas[] = [
  {
    grupo: 'Match novo: os primeiros 10 segundos',
    desc: 'Regra de ouro: reaja ao PERFIL dela, nunca mande um “oi” genérico. Observação específica + leve provocação = resposta.',
    itens: [
      {
        t: 'ok, a terceira foto exige explicação. o que exatamente tá acontecendo ali?',
        p: 'Prova que você olhou de verdade e abre um loop que ela precisa fechar.',
      },
      {
        t: 'antes de qualquer coisa: [coisa específica da bio] é inegociável pra você ou dá pra convencer?',
        p: 'Usa a bio dela como campo de jogo e já cria uma micro-negociação divertida.',
      },
      {
        t: 'aposto que todo mundo comenta [óbvio do perfil]. eu vou comentar [detalhe que ninguém nota].',
        p: 'Se diferencia da fila E entrega a observação: dupla prova de valor.',
      },
      {
        t: 'me diz que [interesse dela] não é só pra foto, porque eu ia ficar genuinamente decepcionado',
        p: 'Desafio leve: agora é ELA que prova algo pra VOCÊ. Inverte a dinâmica padrão.',
      },
      {
        t: 'seu perfil tem energia de quem rouba batata frita do prato e não pede desculpa',
        p: 'Leitura fria divertida. Errar não importa: ela vai corrigir, e isso É a conversa.',
      },
      {
        t: 'deixa eu adivinhar: [palpite ousado sobre ela]. taxa de acerto até hoje: 71%.',
        p: 'O número específico inventado dá humor seco. E o palpite pede confirmação.',
      },
      {
        t: 'entre [coisa A do perfil] e [coisa B do perfil], qual delas é a personalidade e qual é a fase?',
        p: 'Pergunta impossível de ignorar: força escolha e revela como ela se vê.',
      },
      {
        t: 'você tem cara de quem tem uma opinião FORTE sobre [tema leve: pizza com abacaxi, signo, axé]. desembucha.',
        p: '“Desembucha” é comando brincalhão, energia de quem já é íntimo.',
      },
      {
        t: 'vou ser honesto: dei match pela foto. fiquei pela bio. agora quero saber se a conversa sustenta.',
        p: 'Honestidade + desafio. Você avalia também: postura de quem escolhe.',
      },
      {
        t: '[cidade dela]? importante: me indica UM lugar que só quem é de lá conhece. é teste.',
        p: '“É teste” brinca com autoridade e já planta a semente de um encontro local.',
      },
    ],
  },
  {
    grupo: 'Resposta seca / conversa esfriando',
    desc: 'Ela respondeu “kkkk”, “sim”, “que legal”? NÃO mande outra pergunta educada. Mude a energia ou saia. Nunca implore.',
    itens: [
      {
        t: 'kkkk foi a resposta mais econômica que eu já recebi. tô até impressionado',
        p: 'Nomeia a secura com humor em vez de fingir que não viu. Quebra o padrão.',
      },
      {
        t: 'percebi que a conversa entrou em modo de economia de energia. aperta o botão de reiniciar: [pergunta ousada nova]',
        p: 'Assume o comando do rumo sem cobrar nada dela.',
      },
      {
        t: 'você responde igual quem dirige com o joelho: dá pra ver que consegue mais',
        p: 'Provocação calibrada: elogia a capacidade, cutuca a entrega.',
      },
      {
        t: 'tá, essa conversa merece um upgrade. pergunta aleatória: qual foi a última coisa que te fez rir de verdade?',
        p: 'Corta o papo morno no meio e reancora em emoção. É ali que conversa vive.',
      },
      {
        t: 'nota mental: [nome], boa de foto, econômica no teclado. me prova que a nota tá errada',
        p: 'Leitura em voz alta + desafio. Ela vai querer se defender, e isso é engajamento.',
      },
      {
        t: 'vou assumir que você tá digitando uma resposta longa e emocionante há 3 horas',
        p: 'Ironia leve sobre o vácuo, zero cobrança. Mostra que você não está sofrendo.',
      },
      {
        t: 'última tentativa antes de eu te trocar pelo meu podcast: [pergunta específica e fácil de responder]',
        p: 'Escassez com humor. “Última tentativa” põe o prazo na sua mão.',
      },
      {
        t: 'seu “que legal” foi tão entusiasmado que eu quase caí da cadeira',
        p: 'Espelha a secura com sarcasmo carinhoso. Convite pra ela subir o nível.',
      },
      {
        t: 'me responde só com emoji: como foi seu dia de 0 a 🥵?',
        p: 'Barreira de resposta zero: impossível dar trabalho, fácil engatar.',
      },
      {
        t: '[silêncio de 2-3 dias. depois:] voltei. e trouxe uma história que você não vai acreditar: [história de 1 linha]',
        p: 'Sumir sem drama e voltar com VALOR reseta a dinâmica. Zero cobrança na volta.',
      },
    ],
  },
  {
    grupo: 'Reativar conversa morta / vácuo',
    desc: 'NUNCA: “sumida”, “fiz algo?”, “oi de novo”. SEMPRE: voltar com valor novo e zero ressentimento.',
    itens: [
      {
        t: 'acabei de ver/ouvir [coisa específica] e lembrei na hora daquela sua história de [detalhe da conversa antiga]',
        p: 'Mostra memória, coisa rara e valiosa. A volta vem por associação, sem cheiro de carência.',
      },
      {
        t: 'pergunta que não quer calar desde a última conversa: [pergunta curiosa sobre algo que ela contou]',
        p: 'Retoma no ponto quente da última conversa, como se o tempo não tivesse passado.',
      },
      {
        t: 'te devo um update: [novidade sua de 1 linha]. e você me deve a resposta daquela pergunta.',
        p: 'Troca justa: você dá primeiro e cobra depois. Leve e simétrico.',
      },
      {
        t: 'meu app diz que essa conversa foi arquivada por inatividade. vim fazer o desarquivamento oficial',
        p: 'Auto-ironia sobre o vácuo tira TODO o peso. E “oficial” dá charme.',
      },
      {
        t: 'decisão executiva: a gente recomeça essa conversa do zero. oi, prazer, [seu nome]. e você é…?',
        p: '“Decisão executiva” = comando com humor. Reset limpo, sem autópsia do vácuo.',
      },
      {
        t: 'passando pra avisar que [lugar/coisa que vocês falaram] continua existindo e a gente continua não indo',
        p: 'Transforma o plano esquecido em cutucada de encontro, direto ao ponto.',
      },
      {
        t: 'apareceu um meme na minha timeline que é literalmente você. o problema: não posso provar sem te mandar',
        p: 'Loop aberto irresistível + pretexto perfeito de retomada.',
      },
      {
        t: 'sonhei que você tinha me indicado [coisa do universo dela] e era ruim demais. vim conferir se seu gosto é confiável mesmo',
        p: 'Absurdo criativo + desafio ao gosto dela. Ninguém ignora isso.',
      },
      {
        t: 'balanço do semestre: você me deve uma resposta, eu te devo um elogio. começa você',
        p: 'Contabilidade divertida da relação: reconhece o jogo sem sofrer com ele.',
      },
      {
        t: 'sua meta de hoje acaba de chegar: me convencer em uma frase de que essa conversa merece segunda temporada',
        p: 'Inverte 100% o frame: ELA que precisa vender. Confiança pura, com sorriso.',
      },
    ],
  },
  {
    grupo: 'Instagram: stories e DM',
    desc: 'Story é convite aberto. Responda o CONTEÚDO com personalidade, nunca “que linda” na fila com os outros 40.',
    itens: [
      {
        t: '[story de comida] avaliação técnica: 8,5. perdeu ponto na apresentação. onde é? preciso auditar pessoalmente',
        p: 'Nota + auditoria = humor de especialista e semente de encontro no mesmo golpe.',
      },
      {
        t: '[story de viagem] ok mas você tá fazendo a pose de turista ou a de influencer? são diferentes e você sabe',
        p: 'Provocação sobre o meta-jogo da foto. Mais interessante que elogiar a paisagem.',
      },
      {
        t: '[story de treino] respeito. mas quero ver esse mesmo story às 6h de segunda',
        p: 'Valida E desafia a consistência: papo de igual, não de fã.',
      },
      {
        t: '[story de festa] a música tava boa ou vocês estavam fingindo que sim? seja honesta',
        p: '“Seja honesta” puxa cumplicidade: vocês dois contra a festa fake.',
      },
      {
        t: '[story de pet] finalmente alguém interessante no seu perfil. o resto a gente releva',
        p: 'Elogio invertido clássico: provoca VOCÊ e exalta o pet. Ela ri e responde.',
      },
      {
        t: '[story de livro/série] opinião impopular sobre isso em 3, 2, 1: [sua opinião curta e firme]',
        p: 'Opinião firme > pergunta genérica. Discordância leve é combustível de conversa.',
      },
      {
        t: '[story de look] esse look pede um rolê à altura. suposição: você não tem um marcado',
        p: 'Elogio + provocação + abertura de convite, tudo em duas frases.',
      },
    ],
  },
  {
    grupo: 'Puxar o encontro',
    desc: 'Convite forte é ESPECÍFICO (lugar + dia) e casual na forma. Pergunta aberta (“vamos sair algum dia?”) = morte.',
    itens: [
      {
        t: 'chega de teoria. [dia] eu vou em [lugar específico]. você vem junto e a gente confere se essa química sobrevive ao mundo real',
        p: 'Plano feito + convite pra SOMAR. “Conferir a química” dá frame de teste mútuo.',
      },
      {
        t: 'você falou de [coisa que ela ama]. conheço o lugar exato pra isso. quinta ou sábado?',
        p: 'Convite construído com o material DELA + escolha dupla (dois sins possíveis).',
      },
      {
        t: 'proposta: um café de 40 minutos. se for ruim, cada um volta pra sua vida e finge que não aconteceu',
        p: 'Risco baixo e humor. Remove TODA a pressão de “encontro”.',
      },
      {
        t: 'meu radar diz que você é 30% mais engraçada pessoalmente. sexta eu testo essa hipótese',
        p: 'Frame de experimento + data definida. Você conduz, ela confirma.',
      },
      {
        t: 'vou parar de segurar essa conversa boa no chat. me passa sua agenda da semana que eu acho um buraco nela',
        p: 'Nomeia o óbvio (o chat é limite) e age. Direto e confiante.',
      },
    ],
  },
  {
    grupo: 'Pós-encontro: esquentar sem correr atrás',
    desc: 'Depois do encontro, quem manda a régua do jogo é a calibragem: referência interna + próximo passo leve. Nada de relatório.',
    itens: [
      {
        t: 'confirmado: você é mesmo [callback de algo que ela fez/disse no encontro]. tô processando até agora',
        p: 'Piada interna imediata: sela cumplicidade e reabre o canal sem “cheguei bem”.',
      },
      {
        t: 'aviso importante: [coisa que vocês comeram/fizeram] de qualquer outro lugar ficou arruinado pra mim. responsabilidade sua',
        p: '“Culpa” dela por elevar a régua = elogio disfarçado de acusação. Irresistível.',
      },
      {
        t: 'nota do encontro: 9,2. o 0,8 que faltou a gente resolve no próximo',
        p: 'Humor + declaração de próximo encontro como fato, não como súplica.',
      },
      {
        t: '[1-2 dias depois] lembrei da sua tese sobre [assunto do encontro]. pensei num contra-argumento. prepara.',
        p: 'Continuação intelectual do encontro. Mostra presença sem sufocar.',
      },
      {
        t: 'parte 2 do [rolê]: [proposta específica]. mesmo dia da semana pra virar tradição ou você tem medo de compromisso com agenda?',
        p: '“Tradição” projeta futuro com leveza; a provocação final garante resposta.',
      },
      {
        t: 'minha avó perguntou por que eu tava sorrindo pro celular. te responsabilizo formalmente',
        p: 'Vulnerabilidade dosada com humor. Mostra afeto SEM carência.',
      },
      {
        t: '[se ela demorar pós-encontro] sem pressa. só deixando registrado que a cadeira do próximo [lugar] segue reservada',
        p: 'Zero cobrança, porta aberta. O oposto exato do Modo Trouxa.',
      },
      {
        t: 'resumo executivo pro meu grupo: “ela é ainda mais [qualidade real dela] do que parecia”. só achei justo você saber o relatório',
        p: 'Elogio específico entregue com moldura divertida. Memorável e verdadeiro.',
      },
    ],
  },
]

export const TOTAL_ABERTURAS = KIT_ABERTURAS.reduce((n, g) => n + g.itens.length, 0)
