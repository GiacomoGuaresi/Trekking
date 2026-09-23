/**
 * Il tempo di viaggio in auto da casa (docs/02-funzionalita.md): minuti,
 * facoltativi. Si può scrivere a mano, e da quel momento il calcolo automatico
 * non lo sovrascrive più (step 15); svuotando il campo torna automatico.
 */

/** Il tempo scritto nel campo: minuti (`90`) oppure ore e minuti (`1:30`). */
export function pulisciViaggio(testo: string): number | null {
  const scritto = testo.trim()
  if (scritto === '') return null

  // Solo i due punti: con il punto "90.5" sembrerebbe 90 ore e 5 minuti.
  const ore = /^(\d+)\s*:\s*(\d{1,2})$/.exec(scritto)
  if (ore) {
    const minuti = Number(ore[2])
    if (minuti > 59) return null
    return Number(ore[1]) * 60 + minuti
  }

  const minuti = Number(scritto)
  if (!Number.isInteger(minuti) || minuti < 0) return null
  return minuti
}

/** Vale se il campo è vuoto o contiene un tempo buono. */
export function viaggioValido(testo: string): boolean {
  return testo.trim() === '' || pulisciViaggio(testo) !== null
}

/** Quello che si scrive nel campo partendo dal valore salvato. */
export function testoViaggio(minuti: number | null): string {
  return minuti === null ? '' : String(minuti)
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
