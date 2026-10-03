import { useCallback, useEffect, useRef, useState } from 'react'
import { percorsi, trekking } from '../dati'
import type { Coordinate } from '../dominio/coordinate'
import { rimuovi, sostituisci } from '../dominio/elenco'
import { daCalcolare, mancanti } from '../dominio/percorsi'
import type { CampiTrekking, Trekking } from '../dominio/tipi'

export type StatoElenco =
  | { fase: 'caricamento' }
  | { fase: 'errore'; messaggio: string }
  | { fase: 'pronto'; trekking: Trekking[] }

/** I trekking, letti all'apertura e ogni volta che l'app torna in primo piano. */
export function useTrekking() {
  const [stato, setStato] = useState<StatoElenco>({ fase: 'caricamento' })
  /** I trekking a cui il ricalcolo ha tolto il luogo, da segnalare. */
  const [luoghiTolti, setLuoghiTolti] = useState<string[]>([])
  /** L'ultimo elenco, per il ricalcolo che gira in sottofondo. */
  const ultimo = useRef<Trekking[]>([])
  const ricalcolo = useRef<{ inCorso: boolean; ancora: Coordinate | null }>({ inCorso: false, ancora: null })

  useEffect(() => {
    if (stato.fase === 'pronto') ultimo.current = stato.trekking
  }, [stato])

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
  const crea = useCallback(async (campi: CampiTrekking) => {
    const creato = await trekking().crea(campi)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: [creato, ...prima.trekking] } : prima))
    ultimo.current = [creato, ...ultimo.current]
    return creato
  }, [])

  /** Salva le modifiche; se non riesce lancia l'errore, e il modale lo mostra. */
  const aggiorna = useCallback(async (id: string, campi: CampiTrekking) => {
    const cambiato = await trekking().aggiorna(id, campi)
    setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: sostituisci(prima.trekking, cambiato) } : prima))
    ultimo.current = sostituisci(ultimo.current, cambiato)
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

  /**
   * Calcola i tempi di viaggio mancanti (docs/02-funzionalita.md, step 15 e 16),
   * uno alla volta per stare nella quota di openrouteservice. Se il servizio non
   * risponde si ferma: i mancanti si riprovano al prossimo salvataggio o alla
   * prossima apertura. Se parte mentre ne gira già uno, riparte alla fine, così
   * prende anche il trekking appena salvato.
   */
  const calcolaViaggi = useCallback(async (casa: Coordinate) => {
    const servizio = percorsi()
    if (!servizio) return
    if (ricalcolo.current.inCorso) {
      ricalcolo.current.ancora = casa
      return
    }
    ricalcolo.current.inCorso = true
    try {
      let partenza: Coordinate | null = casa
      while (partenza) {
        const da: Coordinate = partenza
        ricalcolo.current.ancora = null
        for (const t of mancanti(ultimo.current)) {
          const corrente = ultimo.current.find((u) => u.id === t.id)
          if (!corrente || !daCalcolare(corrente)) continue
          const esito = await servizio.tempo(da, { lat: corrente.lat!, lon: corrente.lon! })
          if (esito.esito === 'irraggiungibile') return
          const cambiato =
            esito.esito === 'minuti'
              ? await trekking().salvaViaggio(corrente.id, esito.minuti)
              : await trekking().togliLuogo(corrente.id)
          if (!cambiato) continue
          setStato((prima) => (prima.fase === 'pronto' ? { ...prima, trekking: sostituisci(prima.trekking, cambiato) } : prima))
          ultimo.current = sostituisci(ultimo.current, cambiato)
          if (esito.esito === 'impossibile') setLuoghiTolti((prima) => [...prima, corrente.nome])
        }
        partenza = ricalcolo.current.ancora
      }
    } catch (errore) {
      console.error('Ricalcolo dei tempi di viaggio interrotto', errore)
    } finally {
      ricalcolo.current = { inCorso: false, ancora: null }
    }
  }, [])

  const chiudiLuoghiTolti = useCallback(() => setLuoghiTolti([]), [])

  return { stato, ricarica, crea, aggiorna, segnaCompletato, elimina, calcolaViaggi, luoghiTolti, chiudiLuoghiTolti }
}
