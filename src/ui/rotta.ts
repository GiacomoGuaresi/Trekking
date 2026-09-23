import { useSyncExternalStore } from 'react'

/**
 * Le pagine, raggiunte con l'hash (docs/03-architettura.md): `#/` è l'Elenco.
 * Mappa e "Installa l'app" arrivano con gli step 17 e 20 della roadmap. Con
 * l'hash GitHub Pages non vede mai le rotte, quindi non serve un 404.html.
 */
export type Rotta = 'elenco'

export const indirizzi: Record<Rotta, string> = {
  elenco: '#/',
}

/** Qualunque hash sconosciuto porta all'Elenco. */
function leggi(): Rotta {
  return 'elenco'
}

function iscriviti(avvisa: () => void) {
  window.addEventListener('hashchange', avvisa)
  return () => window.removeEventListener('hashchange', avvisa)
}

export function useRotta(): Rotta {
  return useSyncExternalStore(iscriviti, leggi)
}
