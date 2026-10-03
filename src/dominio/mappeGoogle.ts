/**
 * Il luogo da un link di Google Maps (docs/02-funzionalita.md): si incolla nel
 * campo del luogo quello che dà "Condividi" nell'app Maps. I link lunghi
 * (`google.com/maps/...`) si leggono qui; quelli brevi (`maps.app.goo.gl/...`)
 * portano a un link lungo, che l'app chiede alla Edge Function di aprire.
 */

import type { Coordinate } from './coordinate'

/** Quello che si ricava da un link: il punto e, se c'è, il nome del posto. */
export interface LuogoDaLink extends Coordinate {
  nome: string | null
}

function comeUrl(testo: string): URL | null {
  try {
    const url = new URL(testo.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

/** Un link breve di "Condividi": `maps.app.goo.gl/…` o il vecchio `goo.gl/maps/…`. */
export function linkBreve(testo: string): boolean {
  const url = comeUrl(testo)
  if (!url) return false
  return url.hostname === 'maps.app.goo.gl' || (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps/'))
}

/** Un link lungo di Google Maps: `google.com/maps/…`, anche `google.it` e `maps.google.com`. */
export function linkLungo(testo: string): boolean {
  const url = comeUrl(testo)
  if (!url) return false
  const host = url.hostname.replace(/^www\./, '')
  // google.com, google.it, google.co.uk, google.com.br: non google.com.esempio.it.
  const dominio = String.raw`google\.(?:com|[a-z]{2}|com?\.[a-z]{2})`
  return (
    (new RegExp(`^${dominio}$`).test(host) && url.pathname.startsWith('/maps')) ||
    new RegExp(`^maps\\.${dominio}$`).test(host)
  )
}

/** Un link di Google Maps, breve o lungo: il campo del luogo lo tratta a parte. */
export function linkGoogle(testo: string): boolean {
  return linkBreve(testo) || linkLungo(testo)
}

function punto(lat: number, lon: number): Coordinate | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null
  return { lat, lon }
}

const NUMERO = String.raw`(-?\d+(?:\.\d+)?)`

/**
 * Il punto dentro un link lungo, dal più preciso:
 * - `!3d<lat>!4d<lon>`: il segnaposto del posto scelto;
 * - `?q=`, `?query=`, `?ll=` con `lat,lon`;
 * - `/@<lat>,<lon>,`: il centro della mappa, quando non c'è altro.
 */
function puntoDaLink(url: URL): Coordinate | null {
  const testo = decodeURIComponent(url.href)
  const segnaposto = [...testo.matchAll(new RegExp(String.raw`!3d${NUMERO}!4d${NUMERO}`, 'g'))].at(-1)
  if (segnaposto) return punto(Number(segnaposto[1]), Number(segnaposto[2]))
  for (const chiave of ['q', 'query', 'll', 'destination']) {
    const valore = url.searchParams.get(chiave)?.match(new RegExp(String.raw`^\s*${NUMERO}\s*,\s*${NUMERO}\s*$`))
    if (valore) return punto(Number(valore[1]), Number(valore[2]))
  }
  const centro = url.pathname.match(new RegExp(String.raw`/@${NUMERO},${NUMERO}`))
  if (centro) return punto(Number(centro[1]), Number(centro[2]))
  return null
}

/** Il nome dopo `/place/`, senza il CAP davanti: "29022 Bobbio PC" diventa "Bobbio PC". */
function nomeDaLink(url: URL): string | null {
  const pezzo = url.pathname.match(/\/place\/([^/]+)/)?.[1]
  if (!pezzo) return null
  let nome: string
  try {
    nome = decodeURIComponent(pezzo.replace(/\+/g, ' '))
  } catch {
    return null
  }
  nome = nome.replace(/^\d{5}\s+/, '').replace(/\s+/g, ' ').trim()
  // Un posto senza nome ha per nome le sue coordinate: meglio niente.
  if (nome === '' || /^[-\d.,°'"NSEW\s]+$/.test(nome)) return null
  return nome
}

/** Il luogo dentro un link lungo; `null` se il link non ha un punto leggibile. */
export function daLinkLungo(testo: string): LuogoDaLink | null {
  if (!linkLungo(testo)) return null
  const url = comeUrl(testo) as URL
  const trovato = puntoDaLink(url)
  return trovato && { ...trovato, nome: nomeDaLink(url) }
}
