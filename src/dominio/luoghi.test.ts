import { describe, expect, it } from 'vitest'
import { SENZA_LUOGO, daPhoton, luogoDaSalvare, type Luogo } from './luoghi'

const risposta = {
  features: [
    {
      geometry: { coordinates: [10.0421, 46.0234] },
      properties: { name: 'Rifugio Curò', city: 'Valbondione', state: 'Lombardia', country: 'Italia' },
    },
    {
      geometry: { coordinates: [9.8765, 45.9876] },
      properties: { name: 'Lago Barbellino', county: 'Bergamo', country: 'Italia' },
    },
  ],
}

describe('daPhoton', () => {
  it('legge nome e coordinate, con la longitudine per prima come nel GeoJSON', () => {
    expect(daPhoton(risposta)[0]).toEqual({
      nome: 'Rifugio Curò, Valbondione, Lombardia, Italia',
      lat: 46.0234,
      lon: 10.0421,
    })
  })

  it('usa la provincia quando manca il comune', () => {
    expect(daPhoton(risposta)[1].nome).toBe('Lago Barbellino, Bergamo, Italia')
  })

  it('salta quello che non ha un nome o un punto', () => {
    const storta = {
      features: [
        { geometry: { coordinates: [9, 45] }, properties: {} },
        { properties: { name: 'Senza punto' } },
        { geometry: { coordinates: ['nove', 'quarantacinque'] }, properties: { name: 'Punto storto' } },
      ],
    }
    expect(daPhoton(storta)).toEqual([])
  })

  it('con una risposta che non è quella attesa non si arrabbia', () => {
    expect(daPhoton(null)).toEqual([])
    expect(daPhoton({ errore: 'quota finita' })).toEqual([])
  })
})

describe('luogoDaSalvare', () => {
  const scelto: Luogo = { nome: 'Rifugio Curò, Valbondione, Italia', lat: 46.0234, lon: 10.0421 }
  const primo: Luogo = { nome: 'Lago Barbellino, Bergamo, Italia', lat: 45.9876, lon: 9.8765 }

  it('senza niente scritto non c’è luogo', () => {
    expect(luogoDaSalvare('  ', scelto, primo)).toEqual(SENZA_LUOGO)
  })

  it('tiene il suggerimento scelto', () => {
    expect(luogoDaSalvare(scelto.nome, scelto, primo)).toEqual({
      luogo_nome: scelto.nome,
      lat: scelto.lat,
      lon: scelto.lon,
    })
  })

  it('se non si sceglie niente prende il primo risultato', () => {
    expect(luogoDaSalvare('lago barbellino', null, primo)).toEqual({
      luogo_nome: primo.nome,
      lat: primo.lat,
      lon: primo.lon,
    })
  })

  it('se si cambia il testo dopo aver scelto, vale il primo risultato', () => {
    expect(luogoDaSalvare('un altro posto', scelto, primo).luogo_nome).toBe(primo.nome)
  })

  it('se Photon non trova nulla si salva il solo nome scritto', () => {
    expect(luogoDaSalvare('  Baita   di   nonno  ', null, null)).toEqual({
      luogo_nome: 'Baita di nonno',
      lat: null,
      lon: null,
    })
  })
})
