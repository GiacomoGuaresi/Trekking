/**
 * L'ordinamento dell'elenco (docs/02-funzionalita.md): si tocca l'intestazione
 * di una colonna per ordinare, un secondo tocco inverte. Le colonne su cui si
 * può ordinare arrivano con gli step che le aggiungono; l'ordine di default
 * diventerà il tempo di viaggio crescente allo step 15.
 */

import type { Trekking } from './tipi'

export type Colonna = 'nome' | 'creato_il'
export type Verso = 'crescente' | 'decrescente'

export interface Ordinamento {
  colonna: Colonna
  verso: Verso
}

/** All'apertura: i più recenti in cima. */
export const ORDINAMENTO_INIZIALE: Ordinamento = { colonna: 'creato_il', verso: 'decrescente' }

/** Il verso con cui si parte quando si tocca una colonna nuova: il nome A→Z, le date dalla più recente. */
export function versoIniziale(colonna: Colonna): Verso {
  return colonna === 'nome' ? 'crescente' : 'decrescente'
}

/** Tocco sull'intestazione: se è già quella si inverte, altrimenti si cambia colonna. */
export function tocca(ordinamento: Ordinamento, colonna: Colonna): Ordinamento {
  if (ordinamento.colonna !== colonna) return { colonna, verso: versoIniziale(colonna) }
  return { colonna, verso: ordinamento.verso === 'crescente' ? 'decrescente' : 'crescente' }
}

function confronta(a: Trekking, b: Trekking, colonna: Colonna): number {
  if (colonna === 'nome') return a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' })
  return a.creato_il.localeCompare(b.creato_il)
}

/** L'elenco ordinato; a parità vale il nome, così l'ordine non balla. */
export function ordina(elenco: readonly Trekking[], { colonna, verso }: Ordinamento): Trekking[] {
  const segno = verso === 'crescente' ? 1 : -1
  return [...elenco].sort(
    (a, b) => segno * confronta(a, b, colonna) || a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' }),
  )
}
