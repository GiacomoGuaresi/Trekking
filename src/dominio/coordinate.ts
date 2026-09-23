/**
 * Il luogo del trekking indicato per coordinate (docs/02-funzionalita.md): si
 * incollano latitudine e longitudine come si copiano da Google Maps
 * (`45.9876, 9.8765`). Il luogo per nome, con i suggerimenti di Photon, arriva
 * con lo step 12.
 */

export interface Coordinate {
  lat: number
  lon: number
}

/** Le coordinate incollate nel campo; vuoto o storto vuol dire "niente luogo". */
export function pulisciCoordinate(testo: string): Coordinate | null {
  const pezzi = testo
    .trim()
    .split(/[\s,;]+/)
    .filter((pezzo) => pezzo !== '')
  if (pezzi.length !== 2) return null
  const [lat, lon] = pezzi.map(Number)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null
  return { lat, lon }
}

/** Vale se il campo è vuoto o contiene coordinate buone: il luogo non è obbligatorio. */
export function coordinateValide(testo: string): boolean {
  return testo.trim() === '' || pulisciCoordinate(testo) !== null
}

/** Quello che si scrive nel campo partendo da quello che c'è salvato. */
export function testoCoordinate(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return ''
  return `${lat}, ${lon}`
}

/**
 * L'indirizzo per aprire il punto su Google Maps ("Apri in Maps"): con gli URL
 * ufficiali di Google Maps, senza chiave; sul telefono si apre l'app, se c'è,
 * da cui partire con il navigatore.
 */
export function mappaEsterna({ lat, lon }: Coordinate): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
