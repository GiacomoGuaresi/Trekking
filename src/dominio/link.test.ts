import { describe, expect, it } from 'vitest'
import { etichettaLink, perApertura, pulisciLink, righeLink } from './link'

describe('pulisciLink', () => {
  it('una riga per link, senza spazi ai lati né righe vuote', () => {
    expect(pulisciLink(' https://komoot.com/tour/1 \n\n  https://gulliver.it/itinerario/2  \n')).toEqual([
      'https://komoot.com/tour/1',
      'https://gulliver.it/itinerario/2',
    ])
  })

  it('scarta i doppioni e il campo vuoto', () => {
    expect(pulisciLink('a.it\na.it')).toEqual(['a.it'])
    expect(pulisciLink('   \n ')).toEqual([])
  })
})

describe('righeLink', () => {
  it('rimette i link nel campo, uno per riga', () => {
    expect(righeLink(['a.it', 'b.it'])).toBe('a.it\nb.it')
  })
})

describe('perApertura', () => {
  it('lascia com’è un indirizzo completo', () => {
    expect(perApertura('https://komoot.com/tour/1')).toBe('https://komoot.com/tour/1')
  })

  it('aggiunge https:// a chi non ce l’ha', () => {
    expect(perApertura('komoot.com/tour/1')).toBe('https://komoot.com/tour/1')
  })

  it('non apre quello che non è un indirizzo', () => {
    expect(perApertura('appunti del rifugio')).toBeNull()
    expect(perApertura('  ')).toBeNull()
    expect(perApertura('javascript:alert(1)')).toBeNull()
  })
})

describe('etichettaLink', () => {
  it('mostra il sito senza www.', () => {
    expect(etichettaLink('https://www.komoot.com/tour/1')).toBe('komoot.com')
  })

  it('di quello che non è un indirizzo mostra il testo', () => {
    expect(etichettaLink(' appunti ')).toBe('appunti')
  })
})
