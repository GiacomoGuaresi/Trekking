/**
 * I luoghi cercati per nome (docs/02-funzionalita.md): l'app propone quelli
 * trovati da Photon e li converte in coordinate. Qui c'è la parte pura: come si
 * legge una risposta e che cosa finisce nel database.
 */

export interface Luogo {
  /** Come si legge nell'elenco: "Rifugio Curò, Valbondione, Italia". */
  nome: string
  lat: number
  lon: number
}

/** Il luogo così come si salva: o con le coordinate, o col solo nome, o niente. */
export interface LuogoSalvato {
  luogo_nome: string | null
  lat: number | null
  lon: number | null
}

export const SENZA_LUOGO: LuogoSalvato = { luogo_nome: null, lat: null, lon: null }

interface Proprieta {
  name?: unknown
  city?: unknown
  county?: unknown
  state?: unknown
  country?: unknown
}

/** Il nome per esteso: quello del posto, poi il comune, poi lo stato. */
function etichetta(proprieta: Proprieta): string {
  const pezzi = [proprieta.name, proprieta.city ?? proprieta.county, proprieta.state, proprieta.country]
  return pezzi.filter((pezzo): pezzo is string => typeof pezzo === 'string' && pezzo.trim() !== '').join(', ')
}

/**
 * I luoghi dentro una risposta di Photon (GeoJSON): si tengono solo quelli con
 * un nome e un punto, così una risposta strana non rompe i suggerimenti.
 */
export function daPhoton(risposta: unknown): Luogo[] {
  const elementi = (risposta as { features?: unknown })?.features
  if (!Array.isArray(elementi)) return []

  return elementi.flatMap((elemento) => {
    const proprieta = (elemento as { properties?: Proprieta })?.properties ?? {}
    const punto = (elemento as { geometry?: { coordinates?: unknown } })?.geometry?.coordinates
    if (!Array.isArray(punto) || punto.length < 2) return []
    const [lon, lat] = punto
    if (typeof lat !== 'number' || typeof lon !== 'number') return []
    const nome = etichetta(proprieta)
    if (nome === '') return []
    return [{ nome, lat, lon }]
  })
}

/**
 * Che cosa si salva quando il luogo è scritto per nome (docs/02-funzionalita.md):
 * il suggerimento scelto, altrimenti il primo risultato di Photon, altrimenti
 * il solo nome scritto, senza coordinate.
 */
export function luogoDaSalvare(testo: string, scelto: Luogo | null, primo: Luogo | null): LuogoSalvato {
  const scritto = testo.trim().replace(/\s+/g, ' ')
  if (scritto === '') return SENZA_LUOGO
  if (scelto && scelto.nome === scritto) return { luogo_nome: scelto.nome, lat: scelto.lat, lon: scelto.lon }
  if (primo) return { luogo_nome: primo.nome, lat: primo.lat, lon: primo.lon }
  return { luogo_nome: scritto, lat: null, lon: null }
}
