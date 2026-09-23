import { useCallback, useEffect, useState } from 'react'
import { trekking } from '../dati'
import { rimuovi, sostituisci } from '../dominio/elenco'
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

  /** Cambia il nome; se non riesce lancia l'errore, e il modale lo mostra. */
  const rinomina = useCallback(async (id: string, nome: string) => {
    const cambiato = await trekking().rinomina(id, nome)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: sostituisci(prima.trekking, cambiato) } : prima))
    return cambiato
  }, [])

  /** Segna o toglie il completato: sparisce dall'elenco se non si mostrano i completati. */
  const segnaCompletato = useCallback(async (id: string, completato: boolean) => {
    const cambiato = await trekking().segnaCompletato(id, completato)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: sostituisci(prima.trekking, cambiato) } : prima))
    return cambiato
  }, [])

  /** Elimina; la conferma è già stata data dall'interfaccia. */
  const elimina = useCallback(async (id: string) => {
    await trekking().elimina(id)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: rimuovi(prima.trekking, id) } : prima))
  }, [])

  return { stato, ricarica, crea, rinomina, segnaCompletato, elimina }
}
