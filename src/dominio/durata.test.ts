import { describe, expect, it } from 'vitest'
import { durataValida, formattaDurata, pulisciDurata, testoDurata } from './durata'

describe('pulisciDurata', () => {
  it('legge le ore scritte nel campo', () => {
    expect(pulisciDurata('3')).toBe(3)
    expect(pulisciDurata('3.5')).toBe(3.5)
    expect(pulisciDurata(' 0.5 ')).toBe(0.5)
  })

  it('accetta anche la virgola, come si scrive da telefono', () => {
    expect(pulisciDurata('3,5')).toBe(3.5)
  })

  it('il campo vuoto vuol dire niente durata', () => {
    expect(pulisciDurata('')).toBeNull()
  })

  it('rifiuta quello che non è un passo di mezz’ora', () => {
    expect(pulisciDurata('3.2')).toBeNull()
    expect(pulisciDurata('0')).toBeNull()
    expect(pulisciDurata('-2')).toBeNull()
    expect(pulisciDurata('tre ore')).toBeNull()
  })
})

describe('durataValida', () => {
  it('il campo vuoto va bene: la durata non è obbligatoria', () => {
    expect(durataValida('')).toBe(true)
  })

  it('una durata storta ferma il salvataggio', () => {
    expect(durataValida('3.2')).toBe(false)
    expect(durataValida('3.5')).toBe(true)
  })
})

describe('formattaDurata', () => {
  it('scrive le ore e i minuti', () => {
    expect(formattaDurata(3)).toBe('3 h')
    expect(formattaDurata(3.5)).toBe('3 h 30')
    expect(formattaDurata(0.5)).toBe('30 min')
  })

  it('senza durata mette il trattino', () => {
    expect(formattaDurata(null)).toBe('—')
  })
})

describe('testoDurata', () => {
  it('riporta nel campo quello che c’è salvato', () => {
    expect(testoDurata(3.5)).toBe('3.5')
    expect(testoDurata(null)).toBe('')
  })
})
