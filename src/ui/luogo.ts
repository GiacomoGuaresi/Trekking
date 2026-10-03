/**
 * Lo stato del campo del luogo (docs/02-funzionalita.md): un interruttore
 * sceglie se il luogo si scrive per **nome**, con i suggerimenti di Photon, o
 * per **coordinate**, incollate da Google Maps. In tutti e due i campi si può
 * incollare anche un link di Google Maps.
 */

import { linkMappe, luoghi } from '../dati'
import { coordinateValide, pulisciCoordinate, testoCoordinate } from '../dominio/coordinate'
import { daLinkLungo, linkBreve, linkGoogle } from '../dominio/mappeGoogle'
import { SENZA_LUOGO, luogoDaSalvare, type Luogo, type LuogoSalvato } from '../dominio/luoghi'

export type Modo = 'nome' | 'coordinate'

export interface StatoLuogo {
  modo: Modo
  /** Il nome scritto e il suggerimento scelto, se se n'è scelto uno. */
  nome: string
  scelto: Luogo | null
  /** Le coordinate incollate, come testo. */
  coordinate: string
}

/** Come si apre il campo: sul nome, se non è un luogo salvato come sole coordinate. */
export function statoLuogoIniziale(salvato?: LuogoSalvato): StatoLuogo {
  const nome = salvato?.luogo_nome ?? null
  const coordinate = testoCoordinate(salvato?.lat ?? null, salvato?.lon ?? null)
  if (nome === null && coordinate !== '') {
    return { modo: 'coordinate', nome: '', scelto: null, coordinate }
  }
  const scelto =
    nome !== null && salvato?.lat != null && salvato?.lon != null
      ? { nome, lat: salvato.lat, lon: salvato.lon }
      : null
  return { modo: 'nome', nome: nome ?? '', scelto, coordinate: '' }
}

/**
 * Si può salvare: coordinate buone o campo vuoto, e nessun link ancora da
 * leggere, che altrimenti finirebbe salvato come nome del luogo.
 */
export function luogoValido({ modo, nome, coordinate }: StatoLuogo): boolean {
  return modo === 'nome' ? !linkGoogle(nome) : coordinateValide(coordinate)
}

/**
 * Il luogo da salvare. Per coordinate è quello che c'è scritto; per nome vale il
 * suggerimento scelto, altrimenti si chiede a Photon e si prende il primo
 * risultato. Se Photon non risponde si salva il solo nome scritto: il trekking
 * si salva lo stesso.
 */
export async function risolviLuogo({ modo, nome, scelto, coordinate }: StatoLuogo): Promise<LuogoSalvato> {
  if (modo === 'coordinate') {
    const punto = pulisciCoordinate(coordinate)
    return punto === null ? SENZA_LUOGO : { luogo_nome: null, lat: punto.lat, lon: punto.lon }
  }
  if (nome.trim() === '') return SENZA_LUOGO
  if (scelto && scelto.nome === nome.trim().replace(/\s+/g, ' ')) return luogoDaSalvare(nome, scelto, null)
  let primo: Luogo | null = null
  try {
    primo = (await luoghi().cerca(nome))[0] ?? null
  } catch (errore) {
    console.error('Luoghi non cercati', errore)
  }
  return luogoDaSalvare(nome, scelto, primo)
}

/**
 * Il campo dopo aver incollato un link di Google Maps: col nome del posto si
 * passa a "Nome" con il luogo già trovato, senza nome alle coordinate. I link
 * brevi li apre prima la Edge Function. Lancia se il link non si legge.
 */
export async function statoDaLink(testo: string): Promise<StatoLuogo> {
  const lungo = linkBreve(testo) ? await linkMappe().apri(testo) : testo
  const trovato = daLinkLungo(lungo)
  if (trovato === null) throw new Error('Nel link non ci sono coordinate')
  const { nome, lat, lon } = trovato
  if (nome === null) return { modo: 'coordinate', nome: '', scelto: null, coordinate: testoCoordinate(lat, lon) }
  return { modo: 'nome', nome, scelto: { nome, lat, lon }, coordinate: '' }
}
