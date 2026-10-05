/**
 * Un tempo scritto in due campi collegati, ore e minuti: lo usano la durata e
 * il tempo di viaggio, nel form e nei filtri. I campi tengono solo cifre; i
 * minuti oltre il cinquantanove si sommano alle ore.
 */

export interface TestoTempo {
  ore: string
  minuti: string
}

export const TEMPO_VUOTO: TestoTempo = { ore: '', minuti: '' }

/** Solo le cifre, al massimo due: quello che resta in un campo dopo la digitazione. */
export function soloCifre(testo: string): string {
  return testo.replace(/\D/g, '').slice(0, 2)
}

/** I minuti in tutto; i due campi vuoti vogliono dire "niente tempo", uno vuoto vale zero. */
export function pulisciTempo({ ore, minuti }: TestoTempo): number | null {
  const o = ore.trim()
  const m = minuti.trim()
  if (o === '' && m === '') return null
  if (!/^\d*$/.test(o) || !/^\d*$/.test(m)) return null
  return Number(o || 0) * 60 + Number(m || 0)
}

/** Vale se i campi sono vuoti o contengono un tempo. */
export function tempoValido(tempo: TestoTempo): boolean {
  return (tempo.ore.trim() === '' && tempo.minuti.trim() === '') || pulisciTempo(tempo) !== null
}

/** Quello che si scrive nei campi partendo dai minuti salvati. */
export function testoTempo(minuti: number | null): TestoTempo {
  if (minuti === null) return TEMPO_VUOTO
  return { ore: String(Math.floor(minuti / 60)), minuti: String(minuti % 60).padStart(2, '0') }
}

/** Uscendo dai minuti: "90" diventa 1 h 30, "5" diventa "05". */
export function normalizzaTempo(tempo: TestoTempo): TestoTempo {
  const totale = pulisciTempo(tempo)
  if (totale === null || tempo.minuti.trim() === '') return tempo
  return testoTempo(totale)
}
