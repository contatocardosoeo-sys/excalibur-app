// ♠ Prova social REAL. Uma regra: nada entra aqui sem autorização por escrito.
//
// Nunca invente, edite ou "melhore" um depoimento. Depoimento fabricado é
// publicidade enganosa (CDC art. 37 e CONAR), derruba conta de anúncio na Meta
// e vira chargeback. O componente <Provas /> não renderiza nada enquanto o
// array estiver vazio: o site fica honesto por padrão.
//
// Como preencher: DOSSIERY-PROVA.md (recrutamento, autorização, coleta).

export interface Prova {
  /** Primeiro nome + inicial. Nunca nome completo sem pedir. */
  nome: string
  /** Idade e cidade dão concretude. Só publique o que ele autorizou. */
  contexto: string
  /** O que ele escreveu ou falou, verbatim. Corte permitido, reescrita não. */
  texto: string
  /** Resultado observável e verificável. Sem número inventado. */
  resultado: string
  /** ISO. Prova velha perde força e precisa ser rotacionada. */
  data: string
  /** Caminho do print em /public/dossiery/provas (rosto e nome dela borrados). */
  print?: string
  /** Autorização assinada em arquivo. Sem isso, não publica. */
  autorizado: boolean
}

// Vazio de propósito. Preencha com os fundadores beta, um a um, com
// autorização em mãos. Ver DOSSIERY-PROVA.md.
export const PROVAS: Prova[] = []

export const PROVAS_PUBLICAVEIS = PROVAS.filter((p) => p.autorizado)
export const TEM_PROVA = PROVAS_PUBLICAVEIS.length > 0
