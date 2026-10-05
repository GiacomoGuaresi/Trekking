/**
 * Il tempo di viaggio in auto da casa (docs/02-funzionalita.md): minuti,
 * facoltativi. Si può scrivere a mano, e da quel momento il calcolo automatico
 * non lo sovrascrive più (step 15); svuotando il campo torna automatico.
 */

import { pulisciTempo, tempoValido, testoTempo, type TestoTempo } from './tempo'

/** I minuti scritti nei campi ore e minuti; vuoti vogliono dire "niente tempo". */
export function pulisciViaggio(tempo: TestoTempo): number | null {
  return pulisciTempo(tempo)
}

/** Vale se i campi sono vuoti o contengono un tempo buono. */
export function viaggioValido(tempo: TestoTempo): boolean {
  return tempoValido(tempo)
}

/** Quello che si scrive nei campi partendo dai minuti salvati. */
export function testoViaggio(minuti: number | null): TestoTempo {
  return testoTempo(minuti)
}

/** Come si legge nell'elenco: `85` diventa "1 h 25". */
export function formattaViaggio(minuti: number | null): string {
  if (minuti === null) return '—'
  const ore = Math.floor(minuti / 60)
  const resto = minuti % 60
  if (ore === 0) return `${resto} min`
  if (resto === 0) return `${ore} h`
  return `${ore} h ${String(resto).padStart(2, '0')}`
}

/**
 * Se dopo il salvataggio il tempo risulta "scritto a mano" (docs/02-funzionalita.md).
 * Chi lo scrive o lo cambia se lo tiene: dallo step 15 il ricalcolo non lo
 * tocca più. Chi non tocca il campo lascia le cose come stavano, così un tempo
 * calcolato non diventa manuale solo perché si è cambiato il nome.
 */
export function viaggioManuale(
  minuti: number | null,
  prima: { viaggio_minuti: number | null; viaggio_manuale: boolean } | null,
): boolean {
  if (minuti === null) return false
  if (prima === null) return true
  if (minuti !== prima.viaggio_minuti) return true
  return prima.viaggio_manuale
}
