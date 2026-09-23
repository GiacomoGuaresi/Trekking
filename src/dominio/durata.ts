/**
 * La durata del trekking (docs/02-funzionalita.md): ore di andata e ritorno, a
 * passi di mezz'ora (3.5 = 3 ore e 30 minuti), facoltativa. Non si calcola: si
 * scrive solo a mano.
 */

/** Il numero scritto nel campo; vuoto o storto vuol dire "niente durata". */
export function pulisciDurata(testo: string): number | null {
  const scritto = testo.trim().replace(',', '.')
  if (scritto === '') return null
  const ore = Number(scritto)
  if (!Number.isFinite(ore) || ore <= 0) return null
  if (!Number.isInteger(ore * 2)) return null
  return ore
}

/** Vale se il campo è vuoto o contiene una durata buona: se è storta il salvataggio si ferma. */
export function durataValida(testo: string): boolean {
  return testo.trim() === '' || pulisciDurata(testo) !== null
}

/** Quello che si scrive nel campo partendo dal valore salvato. */
export function testoDurata(durata: number | null): string {
  return durata === null ? '' : String(durata)
}

/** Come si legge nell'elenco: `3.5` diventa "3 h 30". */
export function formattaDurata(durata: number | null): string {
  if (durata === null) return '—'
  const ore = Math.floor(durata)
  const minuti = Math.round((durata - ore) * 60)
  if (minuti === 0) return `${ore} h`
  if (ore === 0) return `${minuti} min`
  return `${ore} h ${minuti}`
}
