/**
 * I filtri dell'elenco (docs/02-funzionalita.md). Un trekking a cui **manca il
 * dato** su cui si filtra resta visibile: i filtri nascondono solo chi ha un
 * valore fuori dall'intervallo. Gli altri filtri si aggiungono qui con gli step
 * della roadmap.
 */

import type { Trekking } from './tipi'

export interface Intervallo {
  min: number | null
  max: number | null
}

export interface Filtri {
  dislivello: Intervallo
}

export const FILTRI_VUOTI: Filtri = { dislivello: { min: null, max: null } }

/** Il numero scritto in un campo del filtro: vuoto o storto vuol dire "nessun limite". */
export function limite(testo: string): number | null {
  const scritto = testo.trim()
  if (scritto === '') return null
  const numero = Number(scritto)
  if (!Number.isFinite(numero) || numero < 0) return null
  return numero
}

/** Quello che si scrive in un campo del filtro partendo dal limite. */
export function testoLimite(valore: number | null): string {
  return valore === null ? '' : String(valore)
}

/** Quanti limiti sono accesi: il pulsante dei filtri lo mostra. */
export function quantiFiltri({ dislivello }: Filtri): number {
  return [dislivello.min, dislivello.max].filter((x) => x !== null).length
}

/** Se il valore sta nell'intervallo; chi non ha il dato passa sempre. */
export function dentro(valore: number | null, { min, max }: Intervallo): boolean {
  if (valore === null) return true
  if (min !== null && valore < min) return false
  if (max !== null && valore > max) return false
  return true
}

export function filtra(elenco: readonly Trekking[], filtri: Filtri): Trekking[] {
  return elenco.filter((t) => dentro(t.dislivello, filtri.dislivello))
}
