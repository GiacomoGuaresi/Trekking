/**
 * L'ordinamento dell'elenco (docs/02-funzionalita.md): si tocca l'intestazione
 * di una colonna per ordinare, un secondo tocco inverte. Le colonne su cui si
 * può ordinare arrivano con gli step che le aggiungono; l'ordine di default
 * diventerà il tempo di viaggio crescente allo step 15.
 */

import type { Trekking } from './tipi'

export type Colonna = 'nome' | 'creato_il' | 'dislivello'
export type Verso = 'crescente' | 'decrescente'

export interface Ordinamento {
  colonna: Colonna
  verso: Verso
}

/** All'apertura: i più recenti in cima. */
export const ORDINAMENTO_INIZIALE: Ordinamento = { colonna: 'creato_il', verso: 'decrescente' }

/** Il verso con cui si parte quando si tocca una colonna nuova: le date dalla più recente, il resto dal più piccolo. */
export function versoIniziale(colonna: Colonna): Verso {
  return colonna === 'creato_il' ? 'decrescente' : 'crescente'
}

/** Tocco sull'intestazione: se è già quella si inverte, altrimenti si cambia colonna. */
export function tocca(ordinamento: Ordinamento, colonna: Colonna): Ordinamento {
  if (ordinamento.colonna !== colonna) return { colonna, verso: versoIniziale(colonna) }
  return { colonna, verso: ordinamento.verso === 'crescente' ? 'decrescente' : 'crescente' }
}

function perNome(a: Trekking, b: Trekking): number {
  return a.nome.localeCompare(b.nome, 'it', { sensitivity: 'base' })
}

function confronta(a: Trekking, b: Trekking, colonna: Colonna): number {
  if (colonna === 'nome') return perNome(a, b)
  if (colonna === 'dislivello') return (a.dislivello ?? 0) - (b.dislivello ?? 0)
  return a.creato_il.localeCompare(b.creato_il)
}

/** Chi non ha il valore va in fondo in tutti e due i versi (docs/02-funzionalita.md). */
function senzaValore(trekking: Trekking, colonna: Colonna): boolean {
  return colonna === 'dislivello' && trekking.dislivello === null
}

/** L'elenco ordinato; a parità vale il nome, così l'ordine non balla. */
export function ordina(elenco: readonly Trekking[], { colonna, verso }: Ordinamento): Trekking[] {
  const segno = verso === 'crescente' ? 1 : -1
  return [...elenco].sort((a, b) => {
    const mancaA = senzaValore(a, colonna)
    const mancaB = senzaValore(b, colonna)
    if (mancaA !== mancaB) return mancaA ? 1 : -1
    return segno * confronta(a, b, colonna) || perNome(a, b)
  })
}
