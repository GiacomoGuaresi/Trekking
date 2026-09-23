import { describe, expect, it } from 'vitest'
import { distanza, distanzaDaCasa, formattaDistanza } from './distanza'

const casa = { lat: 45.6983, lon: 9.6773 }
const rifugio = { lat: 46.0618, lon: 10.0477 }

describe('distanza', () => {
  it('misura i chilometri in linea d’aria', () => {
    expect(distanza(casa, rifugio)).toBeCloseTo(49.7, 0)
  })

  it('fra un punto e sé stesso è zero', () => {
    expect(distanza(casa, casa)).toBe(0)
  })

  it('non cambia scambiando i due punti', () => {
    expect(distanza(rifugio, casa)).toBeCloseTo(distanza(casa, rifugio), 6)
  })
})

describe('distanzaDaCasa', () => {
  it('senza luogo o senza casa non c’è distanza', () => {
    expect(distanzaDaCasa({ lat: null, lon: null }, casa)).toBeNull()
    expect(distanzaDaCasa(rifugio, null)).toBeNull()
  })

  it('con tutti e due i punti la calcola', () => {
    expect(distanzaDaCasa(rifugio, casa)).toBeCloseTo(49.7, 0)
  })
})

describe('formattaDistanza', () => {
  it('sotto i dieci chilometri tiene un decimale', () => {
    expect(formattaDistanza(4.25)).toBe('4,3 km')
  })

  it('più lontano arrotonda', () => {
    expect(formattaDistanza(49.7)).toBe('50 km')
  })

  it('senza distanza mette il trattino', () => {
    expect(formattaDistanza(null)).toBe('—')
  })
})
