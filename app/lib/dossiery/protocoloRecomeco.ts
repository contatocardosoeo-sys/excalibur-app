// ♠ Protocolo Recomeço — reconquista fria OU ciclo fechado com dignidade.
// t = a jogada · p = por que funciona

export interface JogadaRecomeco {
  t: string
  p: string
}

export interface FaseRecomeco {
  fase: string
  codinome: string
  objetivo: string
  jogadas: JogadaRecomeco[]
}

export const PROTOCOLO_RECOMECO: FaseRecomeco[] = [
  {
    fase: 'Fase 1 · Diagnóstico Frio',
    codinome: 'A VERDADE NUA',
    objetivo:
      'Decidir com dados, não com saudade: dá pra voltar — e, mais importante, DEVERIA voltar?',
    jogadas: [
      {
        t: 'Papel e caneta: os 3 motivos REAIS do término, em fato — não em versão. “Ela não me valorizava” não é fato. “Cancelei com ela 4 vezes no último mês” é. Se a lista só tem culpa dela, ou só tem sua, refaz.',
        p: 'Saudade é editora de ficção: corta as cenas ruins e recoloca trilha sonora. Decidir voltar em cima de memória editada é decidir errado. Fato escrito no papel é a única coisa que o cérebro apaixonado não consegue reescrever.',
      },
      {
        t: 'Teste da idealização: descreva uma semana comum do ÚLTIMO mês de vocês — o clima, as conversas, os silêncios. Aí responda por escrito: você sente falta DELA ou do começo dela?',
        p: 'O cérebro arquiva o pico e o início, nunca a média. Muito homem quer voltar pra uma mulher que já não existia no fim — e às vezes nunca existiu fora do primeiro ato. Sentir falta do trailer não justifica reassistir o filme.',
      },
      {
        t: 'Os 4 vetos. Se UM for verdade, reconquista está FORA do tabuleiro — você cumpre as Fases 2 e 3 e fecha o ciclo na 6: ela seguiu em frente com outro; houve abuso de qualquer lado, em qualquer direção; você quer voltar por solidão, não por ela; esse foi o 3º término ou pior.',
        p: 'Ela com outro: a resposta já foi dada — disputar é se rebaixar. Abuso: relação que machuca não se recicla, se encerra. Solidão: carência aceita qualquer uma — e ela sente que é qualquer uma. 3º término: isso não é crise, é padrão. E padrão não muda com mais uma rodada do mesmo jogo.',
      },
      {
        t: 'Complete por escrito: “se ela nunca mais voltar, daqui a 1 ano eu quero estar…”. Se a frase não fica de pé sem ela dentro, para tudo: seu problema não é o término. É você sem eixo.',
        p: 'Quem precisa de uma mulher pra ter futuro entrega a ela o volante da própria vida — e ninguém respeita por muito tempo um homem que dirige. Esse diagnóstico dói na hora certa: ele aponta exatamente o trabalho da Fase 3.',
      },
      {
        t: 'Veredito com data e assinatura: “vou tentar reaproximação” OU “vou fechar o ciclo”. Escrito, guardado, decidido a frio. Os dois caminhos passam igual pelas Fases 2 e 3 — a decisão só muda o destino final.',
        p: 'Decisão tomada no frio governa você no calor. Às 2h da manhã, com saudade e álcool, quem não pode mandar é o Modo Trouxa — é o contrato que você assinou sóbrio. Compromisso prévio vence força de vontade em qualquer placar.',
      },
    ],
  },
  {
    fase: 'Fase 2 · Silêncio Estratégico',
    codinome: 'RÁDIO DESLIGADO',
    objetivo:
      'Cortar contato pra reconstruir VOCÊ — o silêncio é desintoxicação sua, nunca castigo pra ela.',
    jogadas: [
      {
        t: '30 a 60 dias de rádio desligado: zero mensagem, zero like, zero “vi isso e lembrei de você”. Pendência prática (chave, conta, buscar coisas)? Resolve curto, educado — e desliga de novo.',
        p: 'Fim de relação roda no mesmo circuito de recompensa que abstinência de vício: cada contato é uma dose que zera o relógio. O silêncio não é tática pra ela sentir sua falta — é o único jeito de VOCÊ voltar a pensar direito. Se a falta vier do lado dela, é bônus. Nunca o objetivo.',
      },
      {
        t: 'Bateu a vontade de mandar mensagem? Escreve TUDO — no bloco de notas, nunca no chat. Relê 24h depois e decide se aquilo era urgente ou era só o Modo Trouxa digitando por você.',
        p: 'A vontade de mandar mensagem é um pico fisiológico: sobe, estoura e desce sozinho em minutos. Escrever descarrega o pico sem custo. Na releitura fria, 9 de 10 mensagens de madrugada te dariam vergonha — o bloco de notas é o airbag entre você e ela.',
      },
      {
        t: 'Stories dela = território proibido. Silencia, deixa de seguir, o que for preciso — vale pros perfis das amigas também. E não pergunta dela pra ninguém: informação sobre a vida dela deixou de ser assunto seu.',
        p: 'Cada story é uma carta de tarô que seu cérebro passa o dia interpretando: “que música é essa? com quem ela tá?”. Vigiar é entregar combustível fresco pro Modo Trouxa toda manhã — e recompensa que vem de vez em quando é exatamente o mecanismo que mantém vício vivo.',
      },
      {
        t: 'Recaiu de madrugada e mandou mensagem carente? Protocolo de dano: não apaga, não manda a segunda explicando a primeira, não grava áudio de desculpa. No máximo UMA linha seca no dia seguinte — “ignora a de ontem. segue o jogo.” — e o relógio do silêncio reinicia sem cerimônia.',
        p: 'O estrago nunca é a recaída — é o combo depois dela. Cada mensagem corrigindo a anterior multiplica a imagem de descontrole. Recaída tratada com frieza vira nota de rodapé. Tratada com desespero, vira o capítulo que ela conta pras amigas.',
      },
      {
        t: 'Ela te bloqueou? O protocolo inteiro acabou aqui. Não existe número novo, perfil fake, recado por amigo nem “esbarrar por acaso”. Bloqueio é um não por escrito: você pula direto pra Fase 3 e depois pra Fase 6.',
        p: 'Contornar bloqueio nunca chega do outro lado como romance — chega como ameaça. E confirma pra ela que terminar foi acerto. Aceitar o não à primeira preserva a única coisa que sobrevive a qualquer fim: seu nome e sua palavra sobre você mesmo.',
      },
    ],
  },
  {
    fase: 'Fase 3 · Reconstrução',
    codinome: 'OUTRO HOMEM',
    objetivo:
      'Virar de verdade o homem que ela não conheceu — e que ficaria bem mesmo se ela nunca soubesse.',
    jogadas: [
      {
        t: 'Corpo primeiro: treino 4x por semana com plano e progressão, sono com hora pra dormir, álcool cortado pela metade. Foto de evolução mensal — privada. Não é conteúdo: é registro seu.',
        p: 'O corpo é a única variável 100% sob seu controle agora — e treino pesado queima o estresse que o término deixou ligado no talo. Seis meses de barra não se fingem: é mudança que dispensa discurso. Primeiro você volta a acreditar em você. Depois isso vaza sozinho.',
      },
      {
        t: 'Mata o tempo ocioso: agenda com treino, trabalho com meta, um projeto daqueles de “um dia eu faço” — começado agora — e gente por perto no fim de semana. Buraco na agenda é onde a ruminação senta e mora.',
        p: 'Você não para de pensar nela por força de vontade — pensamento não obedece ordem direta (tenta NÃO pensar num urso branco agora). Você para quando a cabeça tem material melhor pra processar. Ação vem antes do ânimo. Sempre nessa ordem.',
      },
      {
        t: 'Dinheiro na mesa: dívidas mapeadas, duas assinaturas inúteis cortadas, meta de reserva definida e UM movimento de renda em andamento — aumento, freela ou virada de área. Planilha aberta toda semana, sem exceção.',
        p: 'Aperto financeiro vaza como ansiedade: na voz, na postura, na pressa. Homem apertado aceita migalha — em negociação e em relacionamento. Caixa em ordem compra a frieza que a Fase 4 exige: quem não precisa de nada conversa de igual pra igual.',
      },
      {
        t: 'Reativa o círculo que a relação engoliu: chama os amigos sumidos, aceita os convites que você recusava, conhece gente nova — mulheres inclusive. Mas NADA de postar com outra pra ela ver: indireta de ciúme é o Modo Trouxa de terno novo.',
        p: 'Carência é matemática: uma única fonte de validação transforma qualquer homem em mendigo dela. Várias fontes devolvem o poder de escolha. E teatrinho de ciúme grita o contrário do que você quer mostrar — quem precisa provar que superou não superou. Ela lê isso em segundos.',
      },
      {
        t: 'O teste da porta — regra de ouro da fase: só avança pra Fase 4 quem responde SIM sem engolir seco: “se ela dissesse não amanhã, minha vida continuaria boa?”. Respondeu não? Mais 30 dias de Fase 3. Sem atalho, sem choro.',
        p: 'Quem precisa do sim negocia como refém — e refém aceita qualquer condição. Quem está bem sem o sim conversa relaxado, e ela sente a diferença nos primeiros 10 minutos: necessidade tem cheiro. A ironia do jogo é essa — só tem chance real de voltar quem já estaria inteiro sem voltar.',
      },
    ],
  },
  {
    fase: 'Fase 4 · Reaproximação',
    codinome: 'PRIMEIRO SINAL',
    objetivo:
      'Um contato leve que abre a porta sem empurrar ninguém por ela — e leitura fria da resposta, seja qual for.',
    jogadas: [
      {
        t: 'O primeiro toque: UMA mensagem curta, leve, no presente, com gancho concreto da vida dela — “vi [coisa específica que é a cara dela] e lembrei de você. como você anda?”. Enviada de dia, sóbrio, num dia seu bom. PROIBIDO: “precisamos conversar”, “saudade”, textão, passado.',
        p: '“Precisamos conversar” anuncia peso e arma a defesa dela antes do oi — ninguém abre a porta pra tribunal. Leveza comunica a única coisa que importa agora: você não é mais o homem do final do filme. E mensagem de dia, sóbrio, lê como decisão. De madrugada, lê como recaída.',
      },
      {
        t: 'Resposta QUENTE (rápida, pergunta de volta, estica o papo, ri): duas ou três trocas boas e proposta concreta e curta — “café sábado, 16h, no [lugar novo]?”. E VOCÊ encerra a conversa primeiro, no ponto alto.',
        p: 'Chat infinito queima a energia que devia virar encontro — quem espreme a conversa até secar vira tédio. Encerrar no pico deixa a última impressão alta e assunto sobrando. E convite com dia e hora testa interesse de verdade: resposta a plano concreto não mente.',
      },
      {
        t: 'Resposta MORNA (educada, curta, não puxa nada): espelha o tamanho e o tom, encerra primeiro com classe e some por 2 semanas de vida cheia. Depois, um segundo e ÚLTIMO toque leve. Morno de novo? Trata como frio.',
        p: 'Morno é ela decidindo — e pressão converte dúvida em não. A regra que te blinda do Modo Trouxa é uma só: nunca investir o dobro do que recebe. E as 2 semanas não são joguinho: são você tocando SUA vida de verdade enquanto ela decide a dela.',
      },
      {
        t: 'Resposta FRIA (vácuo, secura ou “prefiro não manter contato”): se houve resposta, fecha com uma linha digna — “entendido. te desejo o bem, é sério.” Se houve vácuo, o silêncio JÁ É a resposta: nada de segunda tentativa mês que vem. Direto pra Fase 6.',
        p: 'Insistir depois do frio é negociar com a realidade — e a realidade não faz contraproposta. Aceitar o não de primeira é a única saída que mantém seu nome de pé. Se um dia ela mudar de ideia, ela sabe onde te encontrar — e ninguém volta pra procurar o homem que implorou.',
      },
      {
        t: 'Lista do proibido no primeiro contato, sem exceção: pedido de desculpa em bloco, declaração de sentimento, “tá saindo com alguém?”, autópsia do término, áudio longo, cobrança de resposta (“vi que visualizou”).',
        p: 'Cada item dessa lista devolve pra ela o trabalho de administrar as SUAS emoções — exatamente o peso que ajudou a acabar. Primeiro contato é amostra do novo, não fatura do antigo. E cobrar visualização é o Modo Trouxa assinando embaixo, com data e hora.',
      },
    ],
  },
  {
    fase: 'Fase 5 · Reconquista',
    codinome: 'MESA NOVA',
    objetivo:
      'Encontro de reset: dinâmica nova, mudança demonstrada em fato — e o passado fora do cardápio até existir mesa firme.',
    jogadas: [
      {
        t: 'Monta o encontro de reset: lugar NOVO pros dois, de dia ou fim de tarde, 1h a 1h30, com compromisso real depois — você tem hora pra sair. Nunca, jamais, os lugares da relação antiga.',
        p: 'Memória é associativa: o bar de vocês liga o filme de vocês — inclusive o final. Território neutro obriga os dois a se apresentarem de novo. E encontro curto com fim marcado tira da mesa a pressão de “resolver tudo hoje”: termina no alto, com vontade sobrando.',
      },
      {
        t: 'Zero tribunal: se o passado invadir a mesa, UMA frase e devolve pro presente — “a gente errou feio ali, e eu sei a minha parte. mas te chamei pelo que vem, não pelo que foi.” — e muda de assunto de verdade.',
        p: 'Reabrir o placar antigo teleporta os dois pros papéis antigos em 30 segundos — e ela vai embora com gosto de término na boca, de novo. Uma frase que assume sem se ajoelhar mostra mais mudança que uma hora de julgamento. Quem controla o clima da mesa lidera o reset.',
      },
      {
        t: 'Mostra, não conta. A frase “eu mudei” está PROIBIDA. A mudança aparece sozinha: o corpo diferente, a calma onde antes era pavio curto, o projeto que você descreve quando ELA pergunta. Nenhum discurso ensaiado.',
        p: '“Eu mudei” é a frase oficial de quem não mudou — ela já ouviu essa, já acreditou e já pagou pra ver. Evidência não pede fé. E conclusão que ela tira sozinha (“ele tá diferente…”) vale dez vezes a que você entrega pronta: convicção própria ninguém desmonta com um deslize seu.',
      },
      {
        t: 'A conversa sobre o que houve: só depois de 2 ou 3 encontros bons, quando a dinâmica nova já existe. Curta, dono da sua parte, sem cobrar a dela no mesmo fôlego: “minha parte naquilo foi [X]. trabalhei nisso assim. a sua leitura, você me conta se e quando quiser.”',
        p: 'Conversa pesada antes de vínculo novo é laje em cima de parede fresca. E assumir a sua parte JÁ cobrando a dela transforma desculpa em fatura — ela fecha na hora. Dono da própria parte, sem exigir troco, é a postura mais rara que ela já viu. Por isso funciona.',
      },
      {
        t: 'Cuidado com o conforto antigo: apelido antigo, sofá antigo, rotina antiga, “já que a gente se conhece, pula etapa”. Não pula. Relação nova cobra as etapas de relação nova — inclusive as boas.',
        p: 'O conforto antigo é o atalho de volta pro sistema que JÁ quebrou — e é confortável pra ela também: tudo de antes, sem decidir nada. Etapa cumprida é preço, e preço cria valor. O que custa zero decisão vale zero compromisso. Se era pra voltar ao que era, não precisava de protocolo.',
      },
    ],
  },
  {
    fase: 'Fase 6 · Veredito',
    codinome: 'PORTA OU PONTE',
    objetivo:
      'Ou acordo novo dito em voz alta, ou fim limpo com luto de prazo curto — e os dois resultados valem vitória.',
    jogadas: [
      {
        t: 'Voltar só com contrato novo, falado com todas as letras: uma conversa sóbria em que CADA UM nomeia o que muda do seu lado e o que precisa do outro — específico e verificável (“celular fora do jantar”, não “mais carinho”). Sem esse acordo, vocês não voltaram: reincidiram.',
        p: 'Casal que volta sem renegociar volta pro sistema exato que já quebrou — e a segunda queda é mais rápida, porque o caminho já está aberto. Acordo específico cria critério: dá pra saber se está sendo cumprido. O vago existe pra proteger quem não pretende mudar. De qualquer lado.',
      },
      {
        t: 'No dia em que voltarem, marca a revisão dos 90 dias: uma conversa com data pra revisitar o acordo — o que está de pé, o que já caiu. Pouco romântico? Sim. Adulto? Completamente.',
        p: 'A lua de mel do retorno anestesia tudo por umas 6 semanas — o teste real começa quando o velho normal bate na porta. Data marcada força a conversa que ninguém quer puxar antes que a mágoa acumule juros. Casal que revisa acordo briga menos que casal que engole.',
      },
      {
        t: 'Não rolou? A mensagem final digna — e só ela: “tentei de verdade e você foi honesta comigo. tá tudo certo. te desejo o melhor, e é sério. fica bem.” Sem culpados, sem “quem sabe um dia”, sem porta entreaberta. Enviou, silenciou tudo, não fica vigiando a reação.',
        p: 'A porta entreaberta parece esperança, mas é coleira — no SEU pescoço, não no dela. O cérebro não arquiva história sem ponto final: fim declarado dói mais uma semana e dói menos uma vida. E a última cena é a moldura — essa mensagem é como você existe na memória dela daqui pra frente.',
      },
      {
        t: 'Luto com prazo e regras: 2 a 4 semanas com direito a sentir TUDO — e proibição total de mandar mensagem, rever foto, ouvir a playlist ou recontar a história pra cada plateia nova. Vencido o prazo, saudade vira gatilho de ação: bateu, você treina, trabalha ou liga pra um amigo. A vida não pausa.',
        p: 'Luto engolido cobra juros — e quem paga é a próxima mulher, que herda um homem mal resolvido. Mas luto sem prazo vira identidade: “o cara que sofreu”. Ritual com data de fim deixa a dor fazer o serviço dela e ir embora. Sentir é obrigatório. Morar na dor é opcional.',
      },
      {
        t: 'Fecha bem mesmo sem plateia: zero rancor público, zero indireta, zero versão distorcida da história pros outros. O ciclo fecha calado, de cabeça erguida — e o Protocolo termina com você maior do que começou, com ou sem ela.',
        p: 'A próxima mulher fareja ex mal resolvida a quilômetros — e testa isso cedo. Quem sai limpo entra no próximo jogo sem dívida e sem mochila: só com a lição. E existe o efeito que você não controla nem deve perseguir: classe no fim é raríssima, e é a única versão sua que envelhece bem na memória de qualquer mulher. Mas isso é consequência. O motivo é outro: é quem você virou.',
      },
    ],
  },
]

export const TOTAL_JOGADAS_RECOMECO = PROTOCOLO_RECOMECO.reduce((n, f) => n + f.jogadas.length, 0)
