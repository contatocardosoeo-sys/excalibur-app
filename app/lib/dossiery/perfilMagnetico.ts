// ♠ Perfil Magnético — o Instagram que trabalha por você.
// t = a ação · p = por que funciona

export interface ItemPerfil {
  t: string
  p: string
}

export interface GrupoPerfil {
  grupo: string
  desc: string
  itens: ItemPerfil[]
}

export const PERFIL_MAGNETICO: GrupoPerfil[] = [
  {
    grupo: 'As 6 Fotos — o stack completo',
    desc: 'Ela julga o stack inteiro em segundos: quem você é, o que você faz, com quem você anda. Regra de ouro: toda foto é sua, real e recente. Vitrine da SUA vida — não fantasia.',
    itens: [
      {
        t: 'Foto 1 (âncora): você nítido, sozinho, olhando levemente fora da câmera, luz natural, fundo com contexto (rua, evento, viagem). Nunca selfie de banheiro.',
        p: 'A primeira foto decide o swipe em 0,8s. Olhar fora da câmera lê como candid (não posado) — e candid transmite status sem esforço.',
      },
      {
        t: 'Foto 2 (social): você com 2-4 amigos, rindo de verdade, você visível de primeira. Sem marcação de ex, sem multidão, sem ninguém te ofuscando.',
        p: 'Prova social é atalho mental antigo: se outros escolhem sua companhia, você é seguro. Grupo grande te dilui — e rastro de ex te desqualifica na hora.',
      },
      {
        t: 'Foto 3 (hobby em movimento): você FAZENDO algo — esporte, som, cozinha, trilha, projeto. Ação acontecendo, não pose segurando equipamento.',
        p: 'Movimento comunica vida que existe sem ela. É essa foto que responde a pergunta silenciosa de todo swipe: "o que a gente faria juntos?"',
      },
      {
        t: 'Foto 4 (humor ou pet): a cena que arranca meio sorriso — o cachorro te derrubando, o momento espontâneo, a situação real. Engraçado sem forçar.',
        p: 'Humor sinaliza inteligência social e desarma a leitura de ameaça. Pet soma: quem mantém um bicho vivo e feliz prova que sabe cuidar de algo além de si.',
      },
      {
        t: 'Foto 5 (corpo com contexto): o físico aparece dentro de cena legítima — praia, futebol, natação, escalada. Nunca shirtless de espelho ou de banheiro.',
        p: 'Mesmo corpo, leitura oposta. Contexto diz "estilo de vida". Espelho diz "preciso que você valide". Ela sente a diferença em 1 segundo.',
      },
      {
        t: 'Foto 6 (mistério/estética): contra-luz, silhueta, você de costas numa paisagem, um detalhe do seu mundo. Fecha o stack com clima, não com mais uma selfie.',
        p: 'Termine com pergunta, não com resposta. Curiosidade aberta (efeito Zeigarnik) é o que faz ela sair do swipe e ir fuçar o resto do seu perfil.',
      },
      {
        t: 'A lista do NUNCA: espelho de academia com flash, carro ou moto que não é seu, shirtless de banheiro, foto com mulher cortada, óculos escuros em todas.',
        p: 'Ela não lê a foto — lê a intenção por trás da foto. Cada item dessa lista grita compensação. É o Modo Trouxa em versão ilustrada, e insegurança farejada fecha a aba.',
      },
    ],
  },
  {
    grupo: 'Bio & Grade',
    desc: 'Bio não é currículo, é gancho. Grade não é álbum, é vitrine. Juntas respondem a única pergunta que importa: como é a vida do lado desse cara?',
    itens: [
      {
        t: 'Bio de 1 linha com gancho: algo específico, verdadeiro e que abre conversa ("Churrasqueiro em evolução. Procuro cobaias corajosas."). Uma linha. Ponto.',
        p: 'Bio-currículo pede aprovação; bio-gancho entrega motivo pronto pra ela puxar papo. Específico e leve vence impressionante e sério — sempre.',
      },
      {
        t: 'Proibido na bio: frase de coach, indireta em forma de reflexão, "só quem é não precisa provar", coração quebrado, lista de idade + cidade + signo.',
        p: 'Frase pronta é pensamento alugado. Indireta na bio é ferida aberta em letreiro luminoso — ela deduz trabalho emocional pendente e passa reto.',
      },
      {
        t: 'Regra dos 9: os últimos 9 posts formam o mosaico que ela vê primeiro. Monte variedade de vida — você, seu mundo, sua gente, seu hobby. Zero sequência de selfie.',
        p: 'Ninguém abre foto por foto: ela lê o conjunto de uma vez. 9 selfies = homem sem vida. 9 paisagens = homem sem rosto. O mosaico é o argumento.',
      },
      {
        t: 'Highlights que servem ao jogo: 3-5 destaques de nome curto — Viagem, Jogo, Projeto, Família. Apague o destaque com ex e a festa de 3 anos atrás.',
        p: 'Highlight é o "melhores momentos" que ela assiste antes de decidir responder sua DM. É reprise jogando a seu favor — ou contra você, se estiver velha e carente.',
      },
      {
        t: 'Legenda com personalidade: uma linha, uma piada interna, uma observação sua. Zero hashtag desesperada, zero textão motivacional.',
        p: 'Legenda é seu tom de voz por escrito. Ela testa como você soa antes de te ouvir de verdade — e humor curto soa como segurança.',
      },
      {
        t: 'Faxina de hoje: apague indiretas, textão de madrugada, homenagem a ex, a fase dark. Agora, não no fim de semana.',
        p: 'Ela VAI rolar até o fundo. Post carente antigo pesa dobrado: parece o "você real" que a versão nova estaria tentando esconder.',
      },
    ],
  },
  {
    grupo: 'Stories Diários',
    desc: 'Story é o perfil respirando. Seu programa diário em 1-3 capítulos, onde ela te acompanha em silêncio e decide se quer entrar nessa vida.',
    itens: [
      {
        t: 'Frequência 1-3 por dia, todo dia: treino acontecendo, projeto na bancada, rolê com os amigos, algo bom que você viu na rua. Café requentado e teto do quarto, não.',
        p: 'Constância te mantém no topo da lista sem virar ruído. Sumir uma semana zera o jogo; metralhar 15 por dia vira papel de parede que ela pula.',
      },
      {
        t: 'Prova social natural: apareça no churrasco, no jogo, na mesa cheia — sem legenda "cercado dos melhores", sem pose ensaiada de balada.',
        p: 'Ela mede seu valor pelo seu entorno. Mostrar dispensa dizer — quem escreve a legenda está tentando provar o que a imagem não provou sozinha.',
      },
      {
        t: 'Técnica mínima: câmera na altura dos olhos ou um palmo acima, luz vindo de frente, fundo limpo. Nunca de baixo pra cima no escuro do quarto.',
        p: 'Ângulo de baixo distorce o rosto e lê como descuido. Você não precisa nascer fotogênico — precisa ser intencional. Intenção é atraente.',
      },
      {
        t: 'Enquete e caixinha que puxam DM: pergunta binária com opinião ("pizza doce é crime?", "praia ou serra?"). Nunca o genérico "me perguntem algo".',
        p: 'Responder enquete custa um toque — o micro-compromisso mais barato do jogo. É ela entrando na SUA DM, pela porta que você deixou aberta.',
      },
      {
        t: 'Proibido pra sempre: indireta triste, print de música sofrência, story carente de madrugada, desabafo em fundo preto.',
        p: 'Story carente é o Modo Trouxa em transmissão ao vivo. Uma noite fraca apaga semanas de imagem sólida — e essa é justamente a que ela vê.',
      },
      {
        t: 'Mostre processo, não discurso: o prato saindo, o shape em construção, o projeto pela metade. Zero frase motivacional em template pronto.',
        p: 'Quem faz, filma. Quem não faz, posta frase. Todo mundo sabe disso por instinto — inclusive ela.',
      },
    ],
  },
  {
    grupo: 'O Jogo dos Stories',
    desc: 'O story dela é onde a conversa nasce sem parecer investida. Regra de ouro: você responde como igual — nunca como fã na plateia.',
    itens: [
      {
        t: 'Responder story dela: comentário curto sobre o CONTEÚDO + gancho ("esse lugar tem cara de esconderijo. onde é?"). Nunca fogo solto, nunca "linda".',
        p: '"Linda" ela recebe 30 vezes por dia — é ingresso pra plateia de fãs. Comentário de conteúdo te tira da fila e abre conversa de igual pra igual.',
      },
      {
        t: 'Não responda tudo: no máximo 1 a cada 3-4 stories bons dela. Escolha o melhor gancho e ignore o resto com tranquilidade.',
        p: 'Atenção escassa é atenção valiosa. Quem comenta tudo anuncia "minha atenção custa zero" — e o que custa zero, vale zero.',
      },
      {
        t: 'Ver e ficar quieto também é jogada: assista, não reaja, e poste a sua vida boa no mesmo dia.',
        p: 'Ela vê quem viu. Presença silenciosa + vida interessante planta a pergunta certa na cabeça dela: "por que ele não fala comigo?"',
      },
      {
        t: 'Caixinha de pergunta dela: responda uma vez, com humor ou opinião honesta. Nada de puxa-saquismo, nada de resposta ensaiada pra impressionar.',
        p: 'Caixinha é convite público de custo baixo — a ponte já veio pronta. Resposta com personalidade vira conversa privada na hora.',
      },
      {
        t: 'Leia quem sempre vê os SEUS: quem assiste tudo e nunca fala está investindo em silêncio. Abra você — leve, sobre conteúdo, sem cobrar o interesse.',
        p: 'Atenção repetida é sinal, não contrato. Mas quem aparece toda noite na sua lista já está curiosa — sua abertura leve só destrava o que já existe.',
      },
      {
        t: 'Ela visualizou e não respondeu? Nada de segunda mensagem, nada de "?". Volte pro seu jogo e continue postando sua vida.',
        p: 'Cobrança confirma carência e fecha a porta. Silêncio tranquilo + rotina boa mantém a porta aberta — e muita conversa volta sozinha quando o jogo continua.',
      },
    ],
  },
  {
    grupo: 'DM Game',
    desc: 'DM é ponte, não moradia. O caminho é um só: story → papo → voz → número → encontro. Quem mora na DM vira contatinho eterno.',
    itens: [
      {
        t: 'Primeira DM: contexto + observação + pergunta leve, sempre sobre algo que ELA postou. Nunca "oi, tudo bem?", nunca elogio físico de abertura.',
        p: '"Oi sumida" chega aos montes e morre em coro no ignorados. Mensagem com contexto prova que você viu a pessoa, não só a foto — isso é raro, e ela nota.',
      },
      {
        t: 'Ritmo com vida própria: responda quando der de verdade, escreva na medida do papo. Nada de resposta em 30 segundos às 3h da manhã.',
        p: 'Tempo de resposta é placar emocional. Resposta instantânea a qualquer hora entrega que não existe mais nada acontecendo na sua vida — e vida vazia repele.',
      },
      {
        t: 'Escale o canal: reação vira papo, papo vira áudio curto, áudio vira chamada rápida. Um degrau por vez, sempre você propondo o próximo.',
        p: 'Cada degrau é um micro-sim que aquece o encontro. Voz humaniza, filtra fantasia dos dois lados e mata a ansiedade do primeiro olá presencial.',
      },
      {
        t: 'Papo com prazo: 2-3 dias de conversa boa e proponha algo concreto — dia, lugar, plano simples ("quinta tem X ali perto, bora?").',
        p: 'Conversa infinita sem convite te arquiva como "amigo de DM". Convite com dia e lugar transmite decisão — e decisão é raridade no meio de mil enroladores.',
      },
      {
        t: 'Saia do Instagram na hora certa: quando ela investe (pergunta de volta, responde com vontade), peça o número sem cerimônia: "me passa teu zap que a gente combina direito".',
        p: 'Trocar de canal é o teste honesto de interesse. Quem quer, passa fácil. Quem não quer, você descobre cedo — e economiza semanas de ilusão.',
      },
      {
        t: 'Levou um não ou um gelo? Aceite de primeira, com classe: "tranquilo, fica o convite". Sem textão, sem cobrança, sem última tentativa.',
        p: 'Reagir bem a um não é o sinal de segurança mais raro do jogo — e o mais lembrado. Insistência transforma um "agora não" em bloqueio pra sempre.',
      },
    ],
  },
  {
    grupo: 'Higiene de Perfil',
    desc: 'Antes de montar a vitrine, limpe o terreno. Auditoria fria, sem dó: abra seu perfil como um estranho abriria — e corte tudo que te entrega.',
    itens: [
      {
        t: 'Expurgo geral: apague post de indireta, sofrência, meme de solteiro sofredor, homenagem a ex, surto de madrugada. Hoje.',
        p: 'Seu histórico é seu dossiê. Ela rola até o fundo — e um post carente antigo pesa mais que dez bons de agora, porque parece o "você sem máscara".',
      },
      {
        t: 'Limpe o seguindo: saia das 50 musas, das páginas de cantada pronta e de frase de macho alfa. O seguindo é público e ela olha.',
        p: 'Feed lotado de musa lê como homem que consome mulher em vez de conviver com mulher. Página de cantada é o seu jogo entregue de graça, com recibo.',
      },
      {
        t: 'Foto de perfil: seu rosto, nítido, sozinho, boa luz — coerente com o resto do perfil. Nunca logo, carro, dupla com amigo ou você minúsculo na paisagem.',
        p: 'É a foto que viaja junto em toda DM que você manda — seu aperto de mão digital. Dupla de amigos gera a pergunta errada: "qual dos dois é ele?"',
      },
      {
        t: 'Nome e @ limpos: nome real ou apelido adulto, pesquisável. Aposente o @_mlk_zika_013 e o "ofc" no final.',
        p: 'Ela vai te pesquisar antes de responder e antes de sair com você. Um @ de adolescente derruba em 2 segundos a imagem de homem que as fotos levantaram.',
      },
      {
        t: 'Auditoria de marcações e comentários: revise as fotos em que te marcaram, desmarque as vergonhosas, apague seus comentários de fã babão em perfil de musa.',
        p: 'O que postam de você e o que você comenta em público também é perfil. Comentário babão em musa é Modo Trouxa registrado com data, hora e testemunhas.',
      },
      {
        t: 'O teste do estranho de 5 segundos: mande o perfil pra um amigo sincero (ou abra deslogado) e pergunte: "que vida esse cara leva?". Resposta errada = volta ao checklist.',
        p: 'Você é cego pro próprio perfil — contexto demais na cabeça. O estranho vê o que ela vê: só a tela. Perfil bom sobrevive a 5 segundos de julgamento frio.',
      },
    ],
  },
]

export const TOTAL_ITENS_PERFIL = PERFIL_MAGNETICO.reduce((n, g) => n + g.itens.length, 0)
