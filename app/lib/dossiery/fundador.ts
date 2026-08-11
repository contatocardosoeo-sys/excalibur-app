// ♠ Escassez REAL em degraus. Cada faixa esgota e o preço sobe de verdade.
// A contagem vem do banco (assinaturas ativas), nunca de timer inventado.
// Regra da casa: se está escrito aqui, é cumprido no servidor.

export interface Degrau {
  nome: string
  vagas: number // tamanho desta faixa
  preco: number // preço anual à vista nesta faixa
  parcela: number // 12x
}

export const DEGRAUS: Degrau[] = [
  { nome: 'Fundador', vagas: 100, preco: 497, parcela: 45 },
  { nome: 'Pioneiro', vagas: 200, preco: 597, parcela: 53 },
  { nome: 'Vanguarda', vagas: 200, preco: 697, parcela: 62 },
]

export const TOTAL_VAGAS = DEGRAUS.reduce((n, d) => n + d.vagas, 0)

// Preço quando os degraus acabarem: sem anual, só mensal cheio.
export const PRECO_DEPOIS = 147

export interface Faixa {
  degrau: Degrau
  indice: number
  vendidosNoDegrau: number
  restantesNoDegrau: number
  esgotado: boolean
}

// Traduz "quantos já entraram" no degrau vigente. Fonte única da verdade,
// usada pelo checkout (servidor) e pela vitrine (cliente).
export function faixaAtual(vendidos: number): Faixa {
  let acumulado = 0
  for (let i = 0; i < DEGRAUS.length; i++) {
    const d = DEGRAUS[i]
    if (vendidos < acumulado + d.vagas) {
      const noDegrau = vendidos - acumulado
      return {
        degrau: d,
        indice: i,
        vendidosNoDegrau: noDegrau,
        restantesNoDegrau: d.vagas - noDegrau,
        esgotado: false,
      }
    }
    acumulado += d.vagas
  }
  const ultimo = DEGRAUS[DEGRAUS.length - 1]
  return {
    degrau: ultimo,
    indice: DEGRAUS.length - 1,
    vendidosNoDegrau: ultimo.vagas,
    restantesNoDegrau: 0,
    esgotado: true,
  }
}
