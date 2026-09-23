import { describe, expect, it } from 'vitest'
import { dislivelloValido, pulisciDislivello, testoDislivello } from './dislivello'

describe('pulisciDislivello', () => {
  it('legge i metri scritti nel campo', () => {
    expect(pulisciDislivello('1200')).toBe(1200)
    expect(pulisciDislivello(' 800 ')).toBe(800)
  })

  it('il campo vuoto vuol dire niente dislivello', () => {
    expect(pulisciDislivello('')).toBeNull()
    expect(pulisciDislivello('   ')).toBeNull()
  })

  it('rifiuta quello che non è un numero intero positivo', () => {
    expect(pulisciDislivello('milleduecento')).toBeNull()
    expect(pulisciDislivello('1200 m')).toBeNull()
    expect(pulisciDislivello('0')).toBeNull()
    expect(pulisciDislivello('-300')).toBeNull()
    expect(pulisciDislivello('120,5')).toBeNull()
    expect(pulisciDislivello('120.5')).toBeNull()
  })
})

describe('dislivelloValido', () => {
  it('il campo vuoto va bene: il dislivello non è obbligatorio', () => {
    expect(dislivelloValido('')).toBe(true)
  })

  it('un campo storto ferma il salvataggio', () => {
    expect(dislivelloValido('tanto')).toBe(false)
    expect(dislivelloValido('1200')).toBe(true)
  })
})

describe('testoDislivello', () => {
  it('riporta nel campo quello che c’è salvato', () => {
    expect(testoDislivello(1200)).toBe('1200')
    expect(testoDislivello(null)).toBe('')
  })
})
