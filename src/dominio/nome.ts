/**
 * Il nome del trekking: l'unico campo obbligatorio (docs/02-funzionalita.md).
 * Si salva ripulito, così i doppioni e l'ordinamento degli step successivi non
 * devono fare i conti con spazi di troppo.
 */

/** Toglie gli spazi ai lati e riduce quelli in mezzo a uno solo. */
export function pulisciNome(testo: string): string {
  return testo.trim().replace(/\s+/g, ' ')
}

/** Un nome vale se, una volta ripulito, resta qualcosa. */
export function nomeValido(testo: string): boolean {
  return pulisciNome(testo) !== ''
}
