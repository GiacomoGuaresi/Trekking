import { useEffect, useState } from 'react'
import { impostazioni } from '../dati'
import type { Coordinate } from '../dominio/coordinate'

/**
 * La posizione di casa, letta una volta all'apertura (docs/04-sicurezza.md):
 * sta nel database, non nella build. Finché non è stata inserita resta `null` e
 * l'app funziona lo stesso, senza la colonna della distanza.
 */
export function useCasa(): Coordinate | null {
  const [casa, setCasa] = useState<Coordinate | null>(null)

  useEffect(() => {
    impostazioni()
      .casa()
      .then(setCasa)
      .catch((errore) => console.error('Posizione di casa non letta', errore))
  }, [])

  return casa
}
