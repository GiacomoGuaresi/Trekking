import { useSyncExternalStore } from 'react'

/**
 * Le pagine, raggiunte con l'hash (docs/03-architettura.md): `#/` è l'Elenco,
 * `#/mappa` è la Mappa, `#/installa` sono le istruzioni per installare l'app.
 * Con l'hash GitHub Pages non vede mai le rotte, quindi non serve un 404.html.
 */
export type Rotta = 'elenco' | 'mappa' | 'installa'

export const indirizzi: Record<Rotta, string> = {
  elenco: '#/',
  mappa: '#/mappa',
  installa: '#/installa',
}

/** Qualunque hash sconosciuto porta all'Elenco. */
function leggi(): Rotta {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash === 'mappa') return 'mappa'
  if (hash === 'installa') return 'installa'
  return 'elenco'
}

function iscriviti(avvisa: () => void) {
  window.addEventListener('hashchange', avvisa)
  return () => window.removeEventListener('hashchange', avvisa)
}

export function useRotta(): Rotta {
  return useSyncExternalStore(iscriviti, leggi, () => 'elenco' as Rotta)
}
