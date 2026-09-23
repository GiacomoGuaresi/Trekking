/**
 * Le piccole modifiche all'elenco già in mano, senza rileggere tutto dal
 * database: l'app resta reattiva anche con la rete lenta.
 */

import type { Trekking } from './tipi'

/** Rimette al suo posto il trekking cambiato, lasciando l'ordine com'è. */
export function sostituisci(elenco: readonly Trekking[], cambiato: Trekking): Trekking[] {
  return elenco.map((t) => (t.id === cambiato.id ? cambiato : t))
}

/** Toglie il trekking eliminato. */
export function rimuovi(elenco: readonly Trekking[], id: string): Trekking[] {
  return elenco.filter((t) => t.id !== id)
}

/**
 * Quelli da mostrare: i completati spariscono, a meno che non si accenda
 * "Mostra completati" (docs/02-funzionalita.md).
 */
export function visibili(elenco: readonly Trekking[], mostraCompletati: boolean): Trekking[] {
  return mostraCompletati ? [...elenco] : elenco.filter((t) => !t.completato)
}

/** Quanti sono nascosti perché completati: l'interruttore lo dice. */
export function quantiCompletati(elenco: readonly Trekking[]): number {
  return elenco.filter((t) => t.completato).length
}
