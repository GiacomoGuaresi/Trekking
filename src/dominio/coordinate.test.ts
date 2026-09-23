import { describe, expect, it } from 'vitest'
import { coordinateValide, mappaEsterna, pulisciCoordinate, testoCoordinate } from './coordinate'

describe('pulisciCoordinate', () => {
  it('legge quello che si copia da Google Maps', () => {
    expect(pulisciCoordinate('45.9876, 9.8765')).toEqual({ lat: 45.9876, lon: 9.8765 })
  })

  it('accetta anche il solo spazio e il punto e virgola', () => {
    expect(pulisciCoordinate('45.9876 9.8765')).toEqual({ lat: 45.9876, lon: 9.8765 })
    expect(pulisciCoordinate(' 45.9876 ; 9.8765 ')).toEqual({ lat: 45.9876, lon: 9.8765 })
  })

  it('tiene le coordinate negative', () => {
    expect(pulisciCoordinate('-33.9, -70.6')).toEqual({ lat: -33.9, lon: -70.6 })
  })

  it('il campo vuoto vuol dire niente luogo', () => {
    expect(pulisciCoordinate('')).toBeNull()
  })

  it('rifiuta un numero solo, tre numeri o del testo', () => {
    expect(pulisciCoordinate('45.9876')).toBeNull()
    expect(pulisciCoordinate('45.9876, 9.8765, 300')).toBeNull()
    expect(pulisciCoordinate('Rifugio Curò')).toBeNull()
  })

  it('rifiuta le coordinate fuori dal mondo', () => {
    expect(pulisciCoordinate('91, 9')).toBeNull()
    expect(pulisciCoordinate('45, 181')).toBeNull()
  })
})

describe('coordinateValide', () => {
  it('il campo vuoto va bene: il luogo non è obbligatorio', () => {
    expect(coordinateValide('')).toBe(true)
  })

  it('un campo storto ferma il salvataggio', () => {
    expect(coordinateValide('qui vicino')).toBe(false)
    expect(coordinateValide('45.9876, 9.8765')).toBe(true)
  })
})

describe('testoCoordinate', () => {
  it('riporta nel campo quello che c’è salvato', () => {
    expect(testoCoordinate(45.9876, 9.8765)).toBe('45.9876, 9.8765')
    expect(testoCoordinate(null, null)).toBe('')
  })
})

describe('mappaEsterna', () => {
  it('porta al punto su OpenStreetMap', () => {
    expect(mappaEsterna({ lat: 45.9876, lon: 9.8765 })).toContain('mlat=45.9876&mlon=9.8765')
  })
})
