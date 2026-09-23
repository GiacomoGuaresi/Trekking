/**
 * I filtri dell'elenco (docs/02-funzionalita.md). Un trekking a cui **manca il
 * dato** su cui si filtra resta visibile: i filtri nascondono solo chi ha un
 * valore fuori dall'intervallo. Gli altri filtri si aggiungono qui con gli step
 * della roadmap.
 */

import type { Coordinate } from './coordinate'
import { distanzaDaCasa } from './distanza'
import type { Trekking } from './tipi'

export interface Intervallo {
  min: number | null
  max: number | null
}

export interface Filtri {
  dislivello: Intervallo
  durata: Intervallo
  /** Chilometri in linea d'aria da casa: si usa il solo massimo. */
  distanza: Intervallo
  /** Minuti in auto da casa: si usa il solo massimo. */
  viaggio: Intervallo
}

export const FILTRI_VUOTI: Filtri = {
  dislivello: { min: null, max: null },
  durata: { min: null, max: null },
  distanza: { min: null, max: null },
  viaggio: { min: null, max: null },
}

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
export function quantiFiltri({ dislivello, durata, distanza, viaggio }: Filtri): number {
  const limiti = [dislivello, durata, distanza, viaggio].flatMap(({ min, max }) => [min, max])
  return limiti.filter((x) => x !== null).length
}

/** Se il valore sta nell'intervallo; chi non ha il dato passa sempre. */
export function dentro(valore: number | null, { min, max }: Intervallo): boolean {
  if (valore === null) return true
  if (min !== null && valore < min) return false
  if (max !== null && valore > max) return false
  return true
}

/** La distanza non è una colonna: si calcola qui, con la posizione di casa. */
export function filtra(elenco: readonly Trekking[], filtri: Filtri, casa: Coordinate | null = null): Trekking[] {
  return elenco.filter(
    (t) =>
      dentro(t.dislivello, filtri.dislivello) &&
      dentro(t.durata_ore, filtri.durata) &&
      dentro(distanzaDaCasa(t, casa), filtri.distanza) &&
      dentro(t.viaggio_minuti, filtri.viaggio),
  )
}
