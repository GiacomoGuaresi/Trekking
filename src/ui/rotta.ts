import { useSyncExternalStore } from 'react'

/**
 * Le pagine, raggiunte con l'hash (docs/03-architettura.md): `#/` è l'Elenco,
 * `#/mappa` è la Mappa. Con l'hash GitHub Pages non vede mai le rotte, quindi
 * non serve un 404.html.
 */
export type Rotta = 'elenco' | 'mappa'

export const indirizzi: Record<Rotta, string> = {
  elenco: '#/',
  mappa: '#/mappa',
}

/** Qualunque hash sconosciuto porta all'Elenco. */
function leggi(): Rotta {
  return window.location.hash.replace(/^#\/?/, '') === 'mappa' ? 'mappa' : 'elenco'
}

function iscriviti(avvisa: () => void) {
  window.addEventListener('hashchange', avvisa)
  return () => window.removeEventListener('hashchange', avvisa)
}

export function useRotta(): Rotta {
  return useSyncExternalStore(iscriviti, leggi, () => 'elenco' as Rotta)
}
