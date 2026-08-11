// ♠ Protocolo Recomeço: reconquista fria OU ciclo fechado com dignidade.
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
      'Decidir com dados, não com saudade: dá pra voltar? E, mais importante, DEVERIA voltar?',
    jogadas: [
      {
        t: 'Papel e caneta: os 3 motivos REAIS do término, em fato, não em versão. “Ela não me valorizava” não é fato. “Cancelei com ela 4 vezes no último mês” é. Se a lista só tem culpa dela, ou só a sua, refaz.',
        p: 'Saudade é editora de ficção: corta as cenas ruins e recoloca a trilha sonora. Fato escrito no papel é a única coisa que o cérebro apaixonado não consegue reescrever.',
      },
      {
        t: 'Teste da idealização: descreva uma semana comum do ÚLTIMO mês de vocês. O clima, as conversas, os silêncios. Aí responda por escrito: você sente falta DELA ou do começo dela?',
        p: 'O cérebro arquiva o pico e o início, nunca a média. Muito homem quer voltar pra uma mulher que só existiu no primeiro ato do filme.',
      },
      {
        t: 'Os 4 vetos. Se UM for verdade, reconquista está FORA do tabuleiro: você cumpre as Fases 2 e 3 e fecha o ciclo na 6. Os vetos: ela seguiu em frente com outro; houve abuso de qualquer lado, em qualquer direção; você quer voltar por solidão, não por ela; esse foi o 3º término ou pior.',
        p: 'Ela com outro é resposta dada, e disputar é se rebaixar; relação com abuso não se recicla, se encerra; carência aceita qualquer uma, e ela sente que é qualquer uma. E 3º término não é crise, é padrão.',
      },
      {
        t: 'Complete por escrito: “se ela nunca mais voltar, daqui a 1 ano eu quero estar…”. Se a frase não fica de pé sem ela dentro, para tudo: o término é o menor dos seus problemas. Você está sem eixo.',
        p: 'Quem precisa de uma mulher pra ter futuro entrega a ela o volante da própria vida. Esse diagnóstico dói na hora certa: ele aponta o trabalho da Fase 3.',
      },
      {
        t: 'Veredito com data e assinatura: “vou tentar reaproximação” OU “vou fechar o ciclo”. Escrito, guardado, decidido a frio. Os dois caminhos passam igual pelas Fases 2 e 3. A decisão só muda o destino final.',
        p: 'Decisão tomada no frio governa você no calor. Às 2h da manhã, com saudade e álcool, quem manda é o contrato que você assinou sóbrio, nunca o Modo Trouxa.',
      },
    ],
  },
  {
    fase: 'Fase 2 · Silêncio Estratégico',
    codinome: 'RÁDIO DESLIGADO',
    objetivo:
      'Cortar contato pra reconstruir VOCÊ. O silêncio é desintoxicação sua, nunca castigo pra ela.',
    jogadas: [
      {
        t: '30 a 60 dias de rádio desligado: zero mensagem, zero like, zero “vi isso e lembrei de você”. Pendência prática (chave, conta, buscar coisas)? Resolve curto, educado, e desliga de novo.',
        p: 'Fim de relação roda no circuito da abstinência: cada contato é uma dose que zera o relógio. O silêncio serve pra VOCÊ voltar a pensar direito; se a falta bater do lado dela, é bônus, nunca o objetivo.',
      },
      {
        t: 'Bateu a vontade de mandar mensagem? Escreve TUDO no bloco de notas, nunca no chat. Relê 24h depois e decide se aquilo era urgente ou só o Modo Trouxa digitando por você.',
        p: 'A vontade de mandar mensagem é um pico: sobe e desce sozinha em minutos, e escrever descarrega sem custo. Na releitura fria, 9 de 10 mensagens de madrugada te dariam vergonha.',
      },
      {
        t: 'Stories dela = território proibido. Silencia ou deixa de seguir, e vale pros perfis das amigas também. E não pergunta dela pra ninguém: a vida dela deixou de ser assunto seu.',
        p: 'Cada story vira carta de tarô que seu cérebro passa o dia interpretando. Vigiar é entregar combustível fresco pro Modo Trouxa toda manhã.',
      },
      {
        t: 'Recaiu de madrugada e mandou mensagem carente? Protocolo de dano: não apaga, não manda a segunda explicando a primeira, não grava áudio de desculpa. No máximo UMA linha seca no dia seguinte, tipo “ignora a de ontem. segue o jogo.”, e o relógio do silêncio reinicia sem cerimônia.',
        p: 'O estrago real mora no combo depois da recaída: cada mensagem corrigindo a anterior multiplica a imagem de descontrole. Recaída tratada com frieza vira nota de rodapé; tratada com desespero, vira o capítulo que ela conta pras amigas.',
      },
      {
        t: 'Ela te bloqueou? O protocolo inteiro acabou aqui. Não existe número novo, perfil fake, recado por amigo nem “esbarrar por acaso”. Bloqueio é um não por escrito: você pula direto pra Fase 3 e depois pra Fase 6.',
        p: 'Contornar bloqueio chega do outro lado como ameaça, e confirma pra ela que terminar foi acerto. Aceitar o não à primeira preserva a única coisa que sobrevive a qualquer fim: seu nome e sua palavra.',
      },
    ],
  },
  {
    fase: 'Fase 3 · Reconstrução',
    codinome: 'OUTRO HOMEM',
    objetivo:
      'Virar de verdade o homem que ela não conheceu, e que ficaria bem mesmo se ela nunca soubesse.',
    jogadas: [
      {
        t: 'Corpo primeiro: treino 4x por semana com plano e progressão, sono com hora pra dormir, álcool cortado pela metade. Foto de evolução mensal, privada. Registro seu, não conteúdo.',
        p: 'O corpo é a única variável 100% sob seu controle agora, e treino pesado queima o estresse que o término deixou ligado. Seis meses de barra não se fingem.',
      },
      {
        t: 'Mata o tempo ocioso: agenda com treino, trabalho com meta, um projeto daqueles de “um dia eu faço” começado agora, e gente por perto no fim de semana. Buraco na agenda é onde a ruminação senta e mora.',
        p: 'Pensamento não obedece ordem direta: tenta NÃO pensar num urso branco agora. Você para de pensar nela quando a cabeça tem material melhor pra processar.',
      },
      {
        t: 'Dinheiro na mesa: dívidas mapeadas, duas assinaturas inúteis cortadas, meta de reserva definida e UM movimento de renda em andamento: aumento, freela ou virada de área. Planilha aberta toda semana, sem exceção.',
        p: 'Aperto financeiro vaza como ansiedade, e homem apertado aceita migalha em negociação e em relacionamento. Caixa em ordem compra a frieza que a Fase 4 exige.',
      },
      {
        t: 'Reativa o círculo que a relação engoliu: chama os amigos sumidos, aceita os convites que você recusava, conhece gente nova, mulheres inclusive. Mas NADA de postar com outra pra ela ver: indireta de ciúme é o Modo Trouxa de terno novo.',
        p: 'Uma única fonte de validação transforma qualquer homem em mendigo dela; várias fontes devolvem o poder de escolha. E quem precisa provar que superou não superou, ela lê isso em segundos.',
      },
      {
        t: 'O teste da porta, regra de ouro da fase: só avança pra Fase 4 quem responde SIM sem engolir seco à pergunta “se ela dissesse não amanhã, minha vida continuaria boa?”. Respondeu não? Mais 30 dias de Fase 3. Sem atalho, sem choro.',
        p: 'Quem precisa do sim negocia como refém, e refém aceita qualquer condição. A ironia do jogo: só tem chance real de voltar quem já estaria inteiro sem voltar.',
      },
    ],
  },
  {
    fase: 'Fase 4 · Reaproximação',
    codinome: 'PRIMEIRO SINAL',
    objetivo:
      'Um contato leve que abre a porta sem empurrar ninguém por ela, e leitura fria da resposta, seja qual for.',
    jogadas: [
      {
        t: 'O primeiro toque: UMA mensagem curta, leve, no presente, com gancho concreto da vida dela: “vi [coisa específica que é a cara dela] e lembrei de você. como você anda?”. Enviada de dia, sóbrio, num dia seu bom. PROIBIDO: “precisamos conversar”, “saudade”, textão, passado.',
        p: '“Precisamos conversar” anuncia peso e arma a defesa dela antes do oi. Mensagem leve enviada de dia, sóbrio, lê como decisão; de madrugada, lê como recaída.',
      },
      {
        t: 'Resposta QUENTE (rápida, pergunta de volta, estica o papo, ri): duas ou três trocas boas e proposta concreta e curta: “café sábado, 16h, no [lugar novo]?”. E VOCÊ encerra a conversa primeiro, no ponto alto.',
        p: 'Chat infinito queima a energia que devia virar encontro. Convite com dia e hora testa interesse de verdade: resposta a plano concreto não mente.',
      },
      {
        t: 'Resposta MORNA (educada, curta, não puxa nada): espelha o tamanho e o tom, encerra primeiro com classe e some por 2 semanas de vida cheia. Depois, um segundo e ÚLTIMO toque leve. Morno de novo? Trata como frio.',
        p: 'Morno é ela decidindo, e pressão converte dúvida em não. A regra que te blinda do Modo Trouxa: nunca investir o dobro do que recebe.',
      },
      {
        t: 'Resposta FRIA (vácuo, secura ou “prefiro não manter contato”): se houve resposta, fecha com uma linha digna: “entendido. te desejo o bem, é sério.” Se houve vácuo, o silêncio JÁ É a resposta: nada de segunda tentativa mês que vem. Direto pra Fase 6.',
        p: 'Insistir depois do frio é negociar com a realidade, e a realidade não faz contraproposta. Aceitar o não de primeira mantém seu nome de pé; se um dia ela mudar de ideia, ela sabe onde te encontrar.',
      },
      {
        t: 'Lista do proibido no primeiro contato, sem exceção: pedido de desculpa em bloco, declaração de sentimento, “tá saindo com alguém?”, autópsia do término, áudio longo, cobrança de resposta (“vi que visualizou”).',
        p: 'Cada item dessa lista devolve pra ela o trabalho de administrar as SUAS emoções, o mesmo peso que ajudou a acabar. Primeiro contato é amostra do novo, não fatura do antigo.',
      },
    ],
  },
  {
    fase: 'Fase 5 · Reconquista',
    codinome: 'MESA NOVA',
    objetivo:
      'Encontro de reset: dinâmica nova, mudança demonstrada em fato, e o passado fora do cardápio até existir mesa firme.',
    jogadas: [
      {
        t: 'Monta o encontro de reset: lugar NOVO pros dois, de dia ou fim de tarde, 1h a 1h30, com compromisso real depois: você tem hora pra sair. Nunca os lugares da relação antiga.',
        p: 'Memória é associativa: o bar de vocês liga o filme de vocês, inclusive o final. Encontro curto com fim marcado tira a pressão de “resolver tudo hoje” e termina no alto.',
      },
      {
        t: 'Zero tribunal: se o passado invadir a mesa, UMA frase e devolve pro presente: “a gente errou feio ali, e eu sei a minha parte. mas te chamei pelo que vem, não pelo que foi”. E muda de assunto de verdade.',
        p: 'Reabrir o placar antigo teleporta os dois pros papéis antigos em 30 segundos. Uma frase que assume sem se ajoelhar mostra mais mudança que uma hora de julgamento.',
      },
      {
        t: 'Mostra, não conta. A frase “eu mudei” está PROIBIDA. A mudança aparece sozinha: o corpo diferente, a calma onde antes era pavio curto, o projeto que você descreve quando ELA pergunta. Nenhum discurso ensaiado.',
        p: '“Eu mudei” é a frase oficial de quem não mudou; ela já ouviu essa, já acreditou e já pagou pra ver. Conclusão que ela tira sozinha vale dez vezes a que você entrega pronta.',
      },
      {
        t: 'A conversa sobre o que houve: só depois de 2 ou 3 encontros bons, quando a dinâmica nova já existe. Curta, dono da sua parte, sem cobrar a dela no mesmo fôlego: “minha parte naquilo foi [X]. trabalhei nisso assim. a sua leitura, você me conta se e quando quiser.”',
        p: 'Conversa pesada antes de vínculo novo é laje em cima de parede fresca. Assumir a sua parte já cobrando a dela transforma desculpa em fatura, e ela fecha na hora.',
      },
      {
        t: 'Cuidado com o conforto antigo: apelido antigo, sofá antigo, rotina antiga, “já que a gente se conhece, pula etapa”. Não pula. Relação nova cobra as etapas de relação nova, inclusive as boas.',
        p: 'O conforto antigo é o atalho de volta pro sistema que JÁ quebrou, e é confortável pra ela também: tudo de antes, sem decidir nada. Etapa cumprida é preço, e o que custa zero decisão vale zero compromisso.',
      },
    ],
  },
  {
    fase: 'Fase 6 · Veredito',
    codinome: 'PORTA OU PONTE',
    objetivo:
      'Ou acordo novo dito em voz alta, ou fim limpo com luto de prazo curto. Os dois resultados valem vitória.',
    jogadas: [
      {
        t: 'Voltar só com contrato novo, falado com todas as letras: uma conversa sóbria em que CADA UM nomeia o que muda do seu lado e o que precisa do outro, específico e verificável (“celular fora do jantar”, não “mais carinho”). Sem esse acordo, o nome disso é reincidência.',
        p: 'Casal que volta sem renegociar volta pro sistema exato que já quebrou, e a segunda queda é mais rápida. Acordo específico cria critério; o vago protege quem não pretende mudar, de qualquer lado.',
      },
      {
        t: 'No dia em que voltarem, marca a revisão dos 90 dias: uma conversa com data pra revisitar o acordo, ver o que está de pé e o que já caiu. Pouco romântico? Sim. Adulto? Completamente.',
        p: 'A lua de mel do retorno anestesia tudo por umas 6 semanas; o teste real começa quando o velho normal bate na porta. Data marcada força a conversa antes que a mágoa acumule juros.',
      },
      {
        t: 'Não rolou? A mensagem final digna, e só ela: “tentei de verdade e você foi honesta comigo. tá tudo certo. te desejo o melhor, e é sério. fica bem.” Sem culpados, sem “quem sabe um dia”, sem porta entreaberta. Enviou, silenciou tudo, não fica vigiando a reação.',
        p: 'A porta entreaberta parece esperança, mas é coleira no SEU pescoço. Fim declarado dói mais uma semana e dói menos uma vida; a última cena é como você existe na memória dela daqui pra frente.',
      },
      {
        t: 'Luto com prazo e regras: 2 a 4 semanas com direito a sentir TUDO, e proibição total de mandar mensagem, rever foto, ouvir a playlist ou recontar a história pra cada plateia nova. Vencido o prazo, saudade vira gatilho de ação: bateu, você treina, trabalha ou liga pra um amigo. A vida não pausa.',
        p: 'Luto engolido cobra juros, e quem paga é a próxima mulher; luto sem prazo vira identidade. Sentir é obrigatório, morar na dor é opcional.',
      },
      {
        t: 'Fecha bem mesmo sem plateia: zero rancor público, zero indireta, zero versão distorcida da história pros outros. O ciclo fecha calado, de cabeça erguida. O Protocolo termina com você maior do que começou, com ou sem ela.',
        p: 'Quem sai limpo entra no próximo jogo sem dívida e sem mochila, só com a lição. Classe no fim envelhece bem na memória de qualquer mulher; mas isso é consequência, o motivo é quem você virou.',
      },
    ],
  },
]

export const TOTAL_JOGADAS_RECOMECO = PROTOCOLO_RECOMECO.reduce((n, f) => n + f.jogadas.length, 0)
