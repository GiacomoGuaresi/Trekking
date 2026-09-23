import { useCallback, useEffect, useState } from 'react'
import { trekking } from '../dati'
import type { Trekking } from '../dominio/tipi'

export type StatoElenco =
  | { fase: 'caricamento' }
  | { fase: 'errore'; messaggio: string }
  | { fase: 'pronto'; trekking: Trekking[] }

/** I trekking, letti all'apertura e ogni volta che l'app torna in primo piano. */
export function useTrekking() {
  const [stato, setStato] = useState<StatoElenco>({ fase: 'caricamento' })

  const ricarica = useCallback(async () => {
    setStato((prima) => (prima.fase === 'pronto' ? prima : { fase: 'caricamento' }))
    try {
      setStato({ fase: 'pronto', trekking: await trekking().elenco() })
    } catch (errore) {
      setStato({ fase: 'errore', messaggio: (errore as Error).message })
    }
  }, [])

  useEffect(() => {
    void ricarica()
    const visibile = () => {
      if (document.visibilityState === 'visible') void ricarica()
    }
    document.addEventListener('visibilitychange', visibile)
    return () => document.removeEventListener('visibilitychange', visibile)
  }, [ricarica])

  /** Crea il trekking; se non riesce lancia l'errore, e il modale lo mostra. */
  const crea = useCallback(async (nome: string) => {
    const creato = await trekking().crea(nome)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: [creato, ...prima.trekking] } : prima))
    return creato
  }, [])

  return { stato, ricarica, crea }
}
