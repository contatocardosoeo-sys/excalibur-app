// ♠ Plano 7 Dias — o bootcamp de entrada. Uma missão por dia, <30min.
// t = o passo · p = por que funciona

export interface PassoDia {
  t: string
  p: string
}

export interface DiaPlano {
  dia: number          // 1-7
  titulo: string       // ex.: 'Faxina'
  codinome: string     // ex.: 'TERRENO LIMPO'
  missao: string       // 1 frase: a missão do dia
  briefing: string     // 2-3 frases de contexto direto
  passos: PassoDia[]   // 4-6 passos executáveis
  criterio: string     // 1 frase: "missão cumprida quando..."
}

export const PLANO_7_DIAS: DiaPlano[] = [
  {
    dia: 1,
    titulo: 'Faxina',
    codinome: 'TERRENO LIMPO',
    missao: 'Limpar seu perfil (Insta + apps) e assinar por escrito onde você trava.',
    briefing: 'Hoje você não fala com ninguém — hoje você arruma o terreno. Toda mensagem que você mandar nos próximos 6 dias vai gerar o mesmo reflexo nela: abrir seu perfil e decidir em 10 segundos se você merece resposta. O Modo Trouxa acha que a conversa começa no "oi"; ela começa na sua última selfie.',
    passos: [
      {
        t: 'Apague hoje: toda indireta triste, todo post de madrugada carente, toda selfie de banheiro. Na dúvida, apaga.',
        p: 'Ela SEMPRE confere o perfil antes de responder. Um post carente de 2023 mata a conversa de hoje antes de você mandar a segunda mensagem.',
      },
      {
        t: 'Selecione 4 fotos pros apps, nesta ordem: rosto nítido sorrindo (sem óculos escuros), corpo inteiro, você fazendo algo que você realmente faz, uma com gente e você em evidência. Nada de banheiro, nada de foto com 3 anos de idade.',
        p: 'A primeira foto decide o swipe; as outras três respondem as perguntas que ela faz em silêncio: como ele é de verdade, o que ele faz da vida, se alguém convive com ele.',
      },
      {
        t: 'Reescreva a bio em 2 linhas: uma coisa concreta que você faz + um detalhe específico que dá assunto (ex.: "faço o melhor churrasco da zona norte, mas queimo qualquer arroz"). Delete "sério e divertido na medida certa" e toda frase que 10 mil caras usam.',
        p: 'Bio genérica não dá o que responder. Detalhe específico é isca de conversa: você facilita o trabalho dela de puxar assunto com você.',
      },
      {
        t: 'No Instagram: arquive o que não mostra vida (print de frase motivacional, story de tela preta com música triste) e deixe visível o que mostra — amigos, hobby, trampo, rolê.',
        p: 'Perfil é prova social muda. Ela não vai perguntar se você tem vida: ela vai concluir sozinha em 3 destaques.',
      },
      {
        t: 'Autoavaliação por escrito, sem plateia: nas últimas 3 conversas que morreram, quem mandou a última mensagem e o que ela dizia? Depois complete no papel: "eu travo em ___" — abrir? sustentar? marcar?',
        p: 'Você não conserta o que não nomeia. Essa frase vira sua mira nos dias 3, 4 e 5 — cada um ataca uma dessas travas.',
      },
      {
        t: 'Pente-fino final de 5 minutos: abra seu perfil como se fosse ela, no celular. Pergunta única: o que aqui me faria NÃO responder esse cara?',
        p: 'Você olha seu perfil com carinho de dono; ela olha com pressa de recrutadora. Esse teste te empresta o olhar dela por 5 minutos.',
      },
    ],
    criterio: 'Missão cumprida quando fotos e bio estão novas e a frase "eu travo em ___" existe por escrito.',
  },
  {
    dia: 2,
    titulo: 'Radar',
    codinome: 'ALVOS VIVOS',
    missao: 'Reativar 3 conversas mortas — sem tocar uma palavra no sumiço.',
    briefing: 'Você não começa do zero: começa do cemitério de conversas que você deixou morrer. Reativar custa menos que abrir no frio, porque o gelo já foi quebrado uma vez. Regra inegociável do dia: ninguém cobra sumiço, ninguém explica silêncio — a conversa recomeça como se a última mensagem fosse ontem.',
    passos: [
      {
        t: 'Varredura de 10 minutos: WhatsApp, Direct e apps. Liste toda conversa dos últimos 6 meses que morreu de tédio (não de fora explícito) e onde houve interesse dos dois lados em algum momento.',
        p: 'Conversa morta por negligência reabre fácil; conversa morta por rejeição não reabre — é outra guerra, e não é a sua hoje.',
      },
      {
        t: 'Corte da lista: quem já te deu um não claro, quem está em relacionamento, ex com final ruim. Sobraram mais de 3? Fique com as 3 de última troca mais quente.',
        p: 'Reativação serve pra retomar o que travou na preguiça ou na logística — não pra insistir com quem já decidiu. Insistência é Modo Trouxa fantasiado de persistência.',
      },
      {
        t: 'Modelo 1 — gatilho concreto: "Acabei de ver [coisa ligada a um papo de vocês] e lembrei de você na hora. Ainda [hábito/assunto que ela contou]?"',
        p: 'O gatilho concreto responde a pergunta que toda reativação levanta — "por que ele apareceu AGORA?" — com um motivo real, não com carência requentada.',
      },
      {
        t: 'Modelo 2 — voto dela: "Preciso de um voto de quem entende: [dúvida leve sobre um tema que ela domina]? Lembrei que você era a autoridade nisso." Adapte os [campos]; nunca mande o molde cru.',
        p: 'Pedir uma opinião pequena dá a ela um papel fácil e agradável na conversa. Ninguém ignora quem a trata como referência no assunto que ela ama.',
      },
      {
        t: 'Dispare as 3 hoje, espaçadas ao longo do dia, de preferência enquanto você faz outra coisa. Proibido em qualquer versão, até de brincadeira: "sumida", "me esqueceu?", "nem fala mais comigo".',
        p: 'Cobrança de sumiço transfere culpa e pede desculpa por existir — os dois matam atração. Quem reabre com presente, e não com fatura, recomeça no lucro.',
      },
      {
        t: 'Protocolo pós-disparo: respondeu, siga o jogo sem citar o hiato. Silêncio por 48h? Arquiva e não manda a segunda. Reativação tem uma bala por alvo.',
        p: 'A segunda mensagem no vácuo transforma "ele lembrou de mim" em "ele está carente" — e apaga o crédito da primeira.',
      },
    ],
    criterio: 'Missão cumprida quando as 3 reativações foram enviadas — o critério é o disparo, não a resposta.',
  },
  {
    dia: 3,
    titulo: 'Abertura',
    codinome: 'PRIMEIRO TIRO',
    missao: 'Abrir 2 conversas novas com a fórmula: observação específica + provocação leve.',
    briefing: '"Oi, tudo bem?" é a mensagem mais enviada e mais ignorada do país — não dá trabalho, então não vale resposta. Abertura boa prova em uma frase que você olhou pra ELA, não pra "uma mulher qualquer". A fórmula do dia: um detalhe específico do perfil dela + uma provocação leve que ela consiga rebater.',
    passos: [
      {
        t: 'Escolha 2 alvos: match novo no app ou uma conhecida com abertura real (colega de curso, amiga de amigo, a moça do grupo de corrida). Fora da lista: quem já te dispensou e quem está comprometida.',
        p: 'Abertura funciona onde existe porta entreaberta. Forçar porta fechada não é jogo — é incômodo, e ainda queima seu nome no círculo social.',
      },
      {
        t: 'Garimpo de 2 minutos por alvo: ache UM detalhe específico — o lugar da terceira foto, o cachorro, a caneca gigante, o time, o livro na estante. Anote. É nele que você atira.',
        p: 'O detalhe específico é a prova de atenção que 95% dos caras não dão. Você sai da pilha de "oi" e vira o único que efetivamente olhou.',
      },
      {
        t: 'Modelo 1 — palpite provocativo: "Vi [detalhe específico] no seu perfil. Vou chutar: você é do time que [palpite leve e engraçado]. Acertei ou já começo pedindo desculpa?"',
        p: 'Palpite é provocação com rede: se acertar, você "leu" ela; se errar, ela corrige — e correção já é conversa andando.',
      },
      {
        t: 'Modelo 2 — contradição charmosa: "Seu perfil inteiro diz [impressão A], mas a [foto/detalhe] entrega [impressão B]. Qual dos dois responde as mensagens?" Adapte os [campos] com o que você garimpou.',
        p: 'Apontar uma contradição divertida cria um mini-mistério sobre ela mesma. Pergunta sobre ela + tom de brincadeira = resposta quase inevitável.',
      },
      {
        t: 'Regras do tiro: provocação é sempre sobre o detalhe, nunca sobre a pessoa; zero elogio de aparência na primeira mensagem; máximo 2 linhas; e se ela não responder, NÃO existe segunda mensagem.',
        p: 'Elogio físico de estranho é moeda inflacionada — ela recebe aos montes. Provocação leve é escassa, e escassez prende atenção.',
      },
      {
        t: 'Teste de voz alta antes de enviar: leia a mensagem falando. Soou entrevista de emprego ou cantada de obra? Reescreve. Soou algo que um amigo engraçado mandaria? Envia.',
        p: 'O ouvido pega o tom que o olho perdoa. Mensagem que constrange em voz alta constrange na tela dela também.',
      },
    ],
    criterio: 'Missão cumprida quando 2 aberturas com detalhe específico saíram do rascunho — zero "oi, tudo bem" no lote.',
  },
  {
    dia: 4,
    titulo: 'Sustentação',
    codinome: 'FOGO CONTÍNUO',
    missao: 'Transformar resposta em conversa: toda mensagem sua termina em gancho.',
    briefing: 'Conseguir resposta é fácil; é na sustentação que o Modo Trouxa derruba a maioria — no interrogatório, no textão, na resposta em 30 segundos. Hoje você não abre nada novo: trabalha o que os dias 2 e 3 acenderam. Regra de ouro: mensagem sem gancho é beco sem saída com seu nome na placa.',
    passos: [
      {
        t: 'Regra do gancho em TODA mensagem de hoje: termine com pergunta curta, opinião que ela possa rebater ou história cortada no clímax ("...e foi aí que o garçom errou tudo. Mas isso é capítulo dois."). "kkk verdade" é atestado de óbito.',
        p: 'Gancho passa a vez com motivo. Sem ele, a conversa só continua se ELA se esforçar — e você ainda não ganhou esse esforço.',
      },
      {
        t: 'Proporção de investimento: responda no tamanho e na energia dela, no máximo um degrau acima. Ela mandou uma linha? Você manda uma ou duas. Parágrafo pra responder "sim" é desespero datilografado.',
        p: 'Investimento muito acima do dela pesa a conversa e entrega ansiedade. Equilíbrio deixa espaço pra ela subir o próprio investimento — e perceber que subiu.',
      },
      {
        t: 'Anti-interrogatório: no máximo 1 pergunta por mensagem, e alterne — depois de uma pergunta, a próxima mensagem é afirmação, história ou opinião puxada do seu dia.',
        p: 'Sequência de perguntas vira entrevista, e entrevista dá trabalho sem dar prazer. Afirmação mostra que você também é conteúdo, não só plateia.',
      },
      {
        t: 'Ritmo de resposta: responda nos intervalos reais do seu dia, não em 30 segundos toda vez — e também não cronometre "o dobro do tempo dela". Celular longe da mesa enquanto trabalha resolve sozinho.',
        p: 'Resposta instantânea 10 vezes seguidas diz "não tenho mais nada na vida". Cronômetro calculado é o mesmo Modo Trouxa de terno: nos dois, o telefone manda em você.',
      },
      {
        t: 'Quando a conversa engatar (3+ trocas com ela investindo), aponte pro mundo real: puxe o que ela faz no fim de semana, o rolê que ela citou, o lugar que ela quer conhecer. Anote as respostas.',
        p: 'Conversa boa é meio, não fim. Essas respostas são a munição exata do Dia 5 — proposta encaixada no que ELA disse não parece proposta, parece continuação.',
      },
      {
        t: 'Se uma conversa morrer mesmo com gancho: deixa morrer com dignidade. Nada de "?", "sumiu de novo" ou "boa noite então né". Você tem outras frentes — aja como quem tem.',
        p: 'Cobrar conversa é regar planta morta na frente da planta viva. Encerrar limpo mantém a porta aberta pra um Dia 2 no futuro.',
      },
    ],
    criterio: 'Missão cumprida quando ao menos 1 conversa passou de 4 trocas suas, todas terminando em gancho.',
  },
  {
    dia: 5,
    titulo: 'A Proposta',
    codinome: 'FECHAR A DATA',
    missao: 'Propor 1 encontro concreto: dia + hora + lugar na mesma mensagem.',
    briefing: 'Conversa que não vira encontro é hobby, não é conquista. O Modo Trouxa passa 3 semanas no "a gente devia sair qualquer dia" — e "qualquer dia" é o único dia que não existe no calendário. Hoje você escolhe a conversa mais quente e fecha a data.',
    passos: [
      {
        t: 'Eleja a conversa mais viva da semana: ela responde, pergunta de volta, ri, investe. É nela — e só nela — que a proposta sai hoje.',
        p: 'Proposta em massa é loteria de trouxa. Uma proposta bem mirada tem mais taxa de sim que cinco desesperadas — e não queima as outras frentes.',
      },
      {
        t: 'Monte com os 3 elementos inegociáveis — dia + hora + lugar — amarrados em algo que ELA disse (o Dia 4 te deu isso). Formato: café ou bar tranquilo, 1h, fácil de chegar. Jantar caro de primeira é pressão.',
        p: 'Plano específico só aceita três saídas: sim, não ou contraproposta — não tem onde enrolar. E encontro leve baixa o custo do sim dela.',
      },
      {
        t: 'Exemplo pronto (adapte os [campos]): "Você falou de [coisa que ela curte] — tem um [lugar] que é exatamente isso. [Dia] às [hora] pra você conferir se eu exagerei?"',
        p: 'A proposta nasce do que ela mesma contou, então não soa pedido solene — soa próximo capítulo lógico. E o desafio leve no final dá um motivo divertido de aceitar.',
      },
      {
        t: 'Se ela hesitar na LOGÍSTICA ("essa semana tá corrida"), saque a alternativa dupla: "Tranquilo — [dia 1] ou [dia 2], qual te salva?" Uma vez só.',
        p: 'Alternativa dupla mantém o plano vivo e devolve o controle pra ela sem cancelar nada. Quem quer ir escolhe um; quem não quer revela isso agora — e te poupa a semana.',
      },
      {
        t: 'Leia a recusa certo: contraproposta ou justificativa com data é interesse vivo; "vamos ver", "te aviso" seco e sem alternativa é não educado. Recebeu o não? "Tranquilo" e vida que segue — proposta negada não se repete.',
        p: 'Aceitar o não em uma linha é o movimento mais raro do jogo — e o que mais preserva seu valor. Insistir transforma um talvez futuro em nunca definitivo.',
      },
      {
        t: 'Veio o sim? Sele em UMA mensagem — "Fechado: [dia], [hora], no [lugar]" — e volte pra conversa normal. Sem agradecer o sim, sem reconfirmar 3 vezes, sem mexer no plano.',
        p: 'Quem agradece demais por um encontro comunica que aquilo é loteria rara na vida dele. Selar e seguir comunica o contrário: pra você, isso é terça-feira.',
      },
    ],
    criterio: 'Missão cumprida quando 1 proposta com dia + hora + lugar foi enviada — "a gente devia sair um dia" não conta como tiro.',
  },
  {
    dia: 6,
    titulo: 'Véspera',
    codinome: 'ANTI-BOLO',
    missao: 'Confirmar o encontro afirmando o plano — e blindar a véspera contra o bolo.',
    briefing: 'O bolo quase nunca nasce no dia: nasce na véspera, na confirmação insegura que soa como "pode cancelar, eu já esperava". Hoje você confirma como quem informa, não como quem pede. Sem encontro marcado ainda, repete o Dia 5 na segunda conversa mais quente — e guarda este briefing pra sua véspera.',
    passos: [
      {
        t: 'Envie UMA confirmação que afirma + loop de curiosidade: "Amanhã [hora] no [lugar], saio direto do [seu compromisso]. Ah — aquela história do [assunto da conversa]? O final eu só conto pessoalmente."',
        p: 'Afirmar o plano comunica que pra você ele já é fato. O loop aberto planta um motivo extra pra ela aparecer: cancelar agora é ficar sem o final.',
      },
      {
        t: 'Risque do vocabulário da véspera: "ainda tá de pé?", "você vai mesmo?", "confirma pra mim?", "não vai me dar bolo né". Uma mensagem de confirmação — e mais nenhuma até o encontro.',
        p: 'Pergunta insegura entrega a saída de emergência de bandeja e sugere que outras já cancelaram antes. Quem trata o plano como frágil ensina ela a tratar igual.',
      },
      {
        t: 'Desmarcou COM remarcação concreta ("sexta não rola, sábado pode?"): interesse vivo. Aceite em uma linha, sele dia + hora + lugar de novo, zero drama — proibido "jura que dessa vez vai?".',
        p: 'Quem remarca com data está reorganizando agenda, não fugindo. Receber isso com leveza confirma que sair com você é simples; cobrar transforma o sábado dela em obrigação.',
      },
      {
        t: 'Desmarcou SEM remarcar ("surgiu um imprevisto, foi mal"): "Tranquilo, acontece" e ponto final. A próxima proposta agora é dela — você não propõe de novo, não manda indireta, não posta story estratégico.',
        p: 'Quem desmarca sem oferecer nada fica com a bola. Se ela quiser, ela acha um jeito — e se não quiser, insistir só adiaria a mesma resposta, com humilhação inclusa no pacote.',
      },
      {
        t: 'Resolva SUA logística hoje: roupa escolhida (limpa, do seu tamanho, sem estampa gritando), trajeto conferido, plano de chegar 5 minutos antes, celular dormindo cedo pra você dormir também.',
        p: 'Ansiedade de véspera é 80% logística mal resolvida. Quem acorda com tudo pronto gasta o dia do encontro sendo interessante, não decidindo camisa.',
      },
    ],
    criterio: 'Missão cumprida quando a confirmação afirmativa foi enviada e roupa + trajeto estão resolvidos — o resto pertence ao dia D.',
  },
  {
    dia: 7,
    titulo: 'Debrief',
    codinome: 'RELATÓRIO',
    missao: 'Fechar a semana com relatório escrito e dar nome ao SEU padrão de Modo Trouxa.',
    briefing: 'Amador repete a semana; profissional lê o relatório e corrige a mira. Hoje não tem mensagem nova — tem 20 minutos, papel e honestidade. O que sair daqui vale mais que qualquer conselho de internet, porque é dado SEU, colhido em campo.',
    passos: [
      {
        t: 'Números frios, sem maquiagem: quantas reativações mandou, quantas aberturas, quantas viraram conversa de 4+ trocas, propôs encontro, ouviu sim? Escreva a linha inteira, mesmo que doa.',
        p: 'Relatório maquiado só engana o próprio general. Número frio mostra ONDE o funil vaza — e vazamento localizado é vazamento consertável.',
      },
      {
        t: 'Arsenal: copie, literalmente, as 3 mensagens suas que melhor renderam resposta na semana e cole num bloco de notas fixo. Releia e anote o que as três têm em comum.',
        p: 'Essas mensagens são o seu estilo funcionando, com prova de campo. Padrão identificado vira técnica repetível — e técnica repetível não depende de inspiração às 23h.',
      },
      {
        t: 'Volte à frase do Dia 1 ("eu travo em ___") e confronte com a semana: confirmou, mudou ou revelou outra trava? Escreva a versão atualizada.',
        p: 'A trava que você declara no escuro e a que aparece em campo raramente são a mesma. Mirar na verdadeira é o que separa a semana 2 da semana 1.',
      },
      {
        t: 'Dê nome ao inimigo: qual erro você repetiu 2+ vezes na semana (respondeu na hora sempre? interrogatório? enrolou pra propor? confirmou pedindo?). Complete por escrito: "Meu Modo Trouxa é ___".',
        p: 'Vilão genérico não morre. O seu agora tem nome, rosto e horário de ataque — na próxima vez você o vê chegando de longe, antes de apertar enviar.',
      },
      {
        t: 'Defina o próximo ciclo: semana que vem, rode os Dias 2 a 6 de novo com o relatório na mão e a trava real na mira. E se quiser isso com missão nova toda semana e progressão de nível, a assinatura Dossiery é a continuação natural deste plano.',
        p: 'Sete dias tiram você do zero; repetição com correção é o que mata o Modo Trouxa em definitivo. O bootcamp termina hoje — o treinamento, só quando virar reflexo.',
      },
    ],
    criterio: 'Missão cumprida quando o relatório está no papel e a frase "Meu Modo Trouxa é ___" tem um final honesto.',
  },
]

export const TOTAL_PASSOS_PLANO = PLANO_7_DIAS.reduce((n, d) => n + d.passos.length, 0)
