/**
 * I link del trekking (docs/02-funzionalita.md): uno o più indirizzi, salvati
 * così come si incollano. Nel form si scrivono uno per riga.
 */

/** Le righe scritte nel campo diventano un elenco: senza spazi ai lati, senza vuote, senza doppioni. */
export function pulisciLink(testo: string): string[] {
  const visti = new Set<string>()
  for (const riga of testo.split('\n')) {
    const link = riga.trim()
    if (link !== '') visti.add(link)
  }
  return [...visti]
}

/** L'elenco torna nel campo, una riga per link. */
export function righeLink(link: readonly string[]): string {
  return link.join('\n')
}

/**
 * L'indirizzo da aprire: se manca `http://` o `https://` si mette `https://`,
 * così anche "komoot.com/tour/1" si apre. Chi non ha la forma di un indirizzo
 * non si apre affatto.
 */
export function perApertura(link: string): string | null {
  const scritto = link.trim()
  if (scritto === '') return null
  const completo = /^https?:\/\//i.test(scritto) ? scritto : `https://${scritto}`
  try {
    const indirizzo = new URL(completo)
    return indirizzo.hostname.includes('.') ? indirizzo.href : null
  } catch {
    return null
  }
}

/** L'etichetta del link nell'elenco: il sito, senza `www.`. */
export function etichettaLink(link: string): string {
  const apribile = perApertura(link)
  if (apribile === null) return link.trim()
  return new URL(apribile).hostname.replace(/^www\./, '')
}
