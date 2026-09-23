// La ricerca dei luoghi per nome (docs/03-architettura.md): si chiama Photon dal
// browser, senza chiave. Passa da un'interfaccia, così Google Places si potrà
// aggiungere come seconda implementazione senza toccare il resto dell'app.

import { daPhoton, type Luogo } from '../dominio/luoghi'

export interface RicercaLuoghi {
  /** I luoghi che somigliano al testo, dal più probabile. */
  cerca(testo: string, segnale?: AbortSignal): Promise<Luogo[]>
}

const QUANTI = 5

export class PhotonLuoghi implements RicercaLuoghi {
  async cerca(testo: string, segnale?: AbortSignal): Promise<Luogo[]> {
    const scritto = testo.trim()
    if (scritto === '') return []
    // Niente `lang=it`: Photon accetta solo default, de, en e fr, e con
    // "default" i nomi tornano già in italiano dove OpenStreetMap li ha.
    const indirizzo = `https://photon.komoot.io/api/?q=${encodeURIComponent(scritto)}&limit=${QUANTI}`
    const risposta = await fetch(indirizzo, { signal: segnale })
    if (!risposta.ok) throw new Error(`Luoghi non cercati: Photon ha risposto ${risposta.status}`)
    return daPhoton(await risposta.json())
  }
}
