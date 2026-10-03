// Il tempo di viaggio in auto da casa (docs/03-architettura.md): si chiama
// openrouteservice dal browser con la chiave del piano gratuito. Passa da
// un'interfaccia, come la ricerca dei luoghi, così il servizio si può cambiare
// senza toccare il resto dell'app.

import type { Coordinate } from '../dominio/coordinate'
import { daOpenRouteService, daSnap, type EsitoPercorso } from '../dominio/percorsi'

export interface CalcoloPercorsi {
  /** Il tempo in auto da `da` ad `a`; non lancia mai, l'esito dice com'è andata. */
  tempo(da: Coordinate, a: Coordinate): Promise<EsitoPercorso>
}

const BASE = 'https://api.openrouteservice.org/v2'

/**
 * Fin dove si cerca la strada più vicina al luogo. Le Directions non vanno
 * oltre 350 m (anche con `radiuses: -1`), troppo poco per cime, laghi e
 * rifugi: per questo il luogo si aggancia prima alla strada con lo Snap.
 */
const RAGGIO_STRADA_METRI = 50_000

export class OpenRouteService implements CalcoloPercorsi {
  constructor(private readonly chiave: string) {}

  private async chiama(percorso: string, corpo: object): Promise<{ stato: number; risposta: unknown }> {
    const risposta = await fetch(`${BASE}${percorso}`, {
      method: 'POST',
      headers: { Authorization: this.chiave, 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
    return { stato: risposta.status, risposta: await risposta.json().catch(() => null) }
  }

  async tempo(da: Coordinate, a: Coordinate): Promise<EsitoPercorso> {
    try {
      const snap = await this.chiama('/snap/driving-car/json', {
        locations: [[a.lon, a.lat]],
        radius: RAGGIO_STRADA_METRI,
      })
      const strada = daSnap(snap.stato, snap.risposta)
      if (strada === 'irraggiungibile') {
        console.error('openrouteservice non ha risposto', snap.stato, snap.risposta)
        return { esito: 'irraggiungibile' }
      }
      if (strada === null) return { esito: 'impossibile' }

      const { stato, risposta } = await this.chiama('/directions/driving-car/json', {
        coordinates: [
          [da.lon, da.lat],
          [strada.lon, strada.lat],
        ],
        // Il massimo che le Directions concedono (350 m): casa e il punto
        // agganciato stanno già su una strada.
        radiuses: [-1, -1],
        instructions: false,
        geometry: false,
      })
      const esito = daOpenRouteService(stato, risposta)
      if (esito.esito === 'irraggiungibile') console.error('openrouteservice non ha risposto', stato, risposta)
      return esito
    } catch (errore) {
      console.error('openrouteservice non raggiungibile', errore)
      return { esito: 'irraggiungibile' }
    }
  }
}
