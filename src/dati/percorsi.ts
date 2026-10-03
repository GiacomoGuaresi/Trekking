// Il tempo di viaggio in auto da casa (docs/03-architettura.md): si chiama
// openrouteservice dal browser con la chiave del piano gratuito. Passa da
// un'interfaccia, come la ricerca dei luoghi, così il servizio si può cambiare
// senza toccare il resto dell'app.

import type { Coordinate } from '../dominio/coordinate'
import { daOpenRouteService, type EsitoPercorso } from '../dominio/percorsi'

export interface CalcoloPercorsi {
  /** Il tempo in auto da `da` ad `a`; non lancia mai, l'esito dice com'è andata. */
  tempo(da: Coordinate, a: Coordinate): Promise<EsitoPercorso>
}

const INDIRIZZO = 'https://api.openrouteservice.org/v2/directions/driving-car/json'

export class OpenRouteService implements CalcoloPercorsi {
  constructor(private readonly chiave: string) {}

  async tempo(da: Coordinate, a: Coordinate): Promise<EsitoPercorso> {
    try {
      const risposta = await fetch(INDIRIZZO, {
        method: 'POST',
        headers: { Authorization: this.chiave, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: [
            [da.lon, da.lat],
            [a.lon, a.lat],
          ],
          // Raggio illimitato: cime, laghi e rifugi si agganciano alla strada
          // più vicina invece di dare "nessun punto raggiungibile".
          radiuses: [-1, -1],
          instructions: false,
          geometry: false,
        }),
      })
      const corpo: unknown = await risposta.json().catch(() => null)
      const esito = daOpenRouteService(risposta.status, corpo)
      if (esito.esito === 'irraggiungibile') console.error('openrouteservice non ha risposto', risposta.status, corpo)
      return esito
    } catch (errore) {
      console.error('openrouteservice non raggiungibile', errore)
      return { esito: 'irraggiungibile' }
    }
  }
}
