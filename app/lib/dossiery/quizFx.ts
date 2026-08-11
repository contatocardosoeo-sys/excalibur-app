// ♠ Feedback do quiz: som + vibração. Zero arquivo, zero download.
// Web Audio criado só no primeiro toque (política de autoplay exige gesto),
// então nada toca sozinho quando a página abre.

let ctx: AudioContext | null = null
let ligado = true

const CHAVE = 'dossiery_som'

export function somLigado(): boolean {
  return ligado
}

export function carregarPreferencia() {
  if (typeof window === 'undefined') return
  ligado = window.localStorage.getItem(CHAVE) !== 'off'
}

export function alternarSom(): boolean {
  ligado = !ligado
  try {
    window.localStorage.setItem(CHAVE, ligado ? 'on' : 'off')
  } catch {
    /* modo privado: só não persiste */
  }
  if (ligado) tocar('select')
  return ligado
}

function pegarCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// Uma nota curta com envelope, pra não estalar.
function nota(freq: number, inicio: number, dur: number, vol: number, tipo: OscillatorType = 'sine') {
  const c = pegarCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(freq, c.currentTime + inicio)
  g.gain.setValueAtTime(0, c.currentTime + inicio)
  g.gain.linearRampToValueAtTime(vol, c.currentTime + inicio + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + inicio + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(c.currentTime + inicio)
  osc.stop(c.currentTime + inicio + dur + 0.02)
}

export type Fx = 'select' | 'next' | 'reveal' | 'erro' | 'lock'

export function tocar(fx: Fx) {
  if (!ligado) return
  switch (fx) {
    case 'select': // toque seco de confirmação
      nota(523.25, 0, 0.07, 0.05, 'triangle')
      break
    case 'next': // avanço: duas notas subindo
      nota(587.33, 0, 0.06, 0.045, 'triangle')
      nota(783.99, 0.055, 0.08, 0.04, 'triangle')
      break
    case 'reveal': // dossiê aberto: acorde grave e seco
      nota(261.63, 0, 0.5, 0.05, 'sine')
      nota(392.0, 0.06, 0.5, 0.045, 'sine')
      nota(523.25, 0.12, 0.55, 0.04, 'sine')
      break
    case 'lock': // etapa concluída
      nota(880, 0, 0.05, 0.035, 'square')
      nota(1174.66, 0.05, 0.09, 0.03, 'square')
      break
    case 'erro':
      nota(146.83, 0, 0.18, 0.05, 'sawtooth')
      break
  }
}

// Vibração curta no celular. Silenciosa em desktop e onde não houver suporte.
export function vibrar(padrao: number | number[] = 12) {
  if (!ligado) return
  try {
    navigator.vibrate?.(padrao)
  } catch {
    /* sem suporte */
  }
}
