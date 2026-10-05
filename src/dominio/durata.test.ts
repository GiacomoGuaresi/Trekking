import { describe, expect, it } from 'vitest'
import { durataValida, formattaDurata, pulisciDurata, testoDurata } from './durata'

describe('pulisciDurata', () => {
  it('legge ore e minuti e li porta in ore', () => {
    expect(pulisciDurata({ ore: '3', minuti: '' })).toBe(3)
    expect(pulisciDurata({ ore: '3', minuti: '30' })).toBe(3.5)
    expect(pulisciDurata({ ore: '', minuti: '30' })).toBe(0.5)
    expect(pulisciDurata({ ore: '', minuti: '90' })).toBe(1.5)
  })

  it('i campi vuoti vogliono dire niente durata', () => {
    expect(pulisciDurata({ ore: '', minuti: '' })).toBeNull()
  })

  it('rifiuta quello che non è un passo di mezz’ora', () => {
    expect(pulisciDurata({ ore: '3', minuti: '20' })).toBeNull()
    expect(pulisciDurata({ ore: '0', minuti: '00' })).toBeNull()
    expect(pulisciDurata({ ore: 'tre', minuti: '' })).toBeNull()
  })
})

describe('durataValida', () => {
  it('i campi vuoti vanno bene: la durata non è obbligatoria', () => {
    expect(durataValida({ ore: '', minuti: '' })).toBe(true)
  })

  it('una durata storta ferma il salvataggio', () => {
    expect(durataValida({ ore: '3', minuti: '20' })).toBe(false)
    expect(durataValida({ ore: '3', minuti: '30' })).toBe(true)
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
    expect(testoDurata(3.5)).toEqual({ ore: '3', minuti: '30' })
    expect(testoDurata(null)).toEqual({ ore: '', minuti: '' })
  })
})
