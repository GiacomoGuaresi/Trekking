import { describe, expect, it } from 'vitest'
import { normalizzaTempo, pulisciTempo, soloCifre, tempoValido, testoTempo } from './tempo'

describe('pulisciTempo', () => {
  it('somma ore e minuti', () => {
    expect(pulisciTempo({ ore: '1', minuti: '30' })).toBe(90)
    expect(pulisciTempo({ ore: '2', minuti: '05' })).toBe(125)
  })

  it('un campo vuoto vale zero', () => {
    expect(pulisciTempo({ ore: '3', minuti: '' })).toBe(180)
    expect(pulisciTempo({ ore: '', minuti: '45' })).toBe(45)
  })

  it('i minuti oltre il cinquantanove si sommano alle ore', () => {
    expect(pulisciTempo({ ore: '', minuti: '90' })).toBe(90)
  })

  it('i due campi vuoti vogliono dire niente tempo', () => {
    expect(pulisciTempo({ ore: '', minuti: '' })).toBeNull()
  })

  it('rifiuta quello che non è un numero', () => {
    expect(pulisciTempo({ ore: 'un', minuti: '' })).toBeNull()
    expect(pulisciTempo({ ore: '-1', minuti: '' })).toBeNull()
  })
})

describe('tempoValido', () => {
  it('i campi vuoti vanno bene: il tempo non è obbligatorio', () => {
    expect(tempoValido({ ore: '', minuti: '' })).toBe(true)
    expect(tempoValido({ ore: '1', minuti: '30' })).toBe(true)
    expect(tempoValido({ ore: 'x', minuti: '' })).toBe(false)
  })
})

describe('soloCifre', () => {
  it('tiene al massimo due cifre', () => {
    expect(soloCifre('1:')).toBe('1')
    expect(soloCifre('123')).toBe('12')
    expect(soloCifre('a5')).toBe('5')
  })
})

describe('testoTempo', () => {
  it('riporta nei campi i minuti salvati', () => {
    expect(testoTempo(85)).toEqual({ ore: '1', minuti: '25' })
    expect(testoTempo(120)).toEqual({ ore: '2', minuti: '00' })
    expect(testoTempo(5)).toEqual({ ore: '0', minuti: '05' })
    expect(testoTempo(null)).toEqual({ ore: '', minuti: '' })
  })
})

describe('normalizzaTempo', () => {
  it('passa alle ore i minuti di troppo e mette due cifre', () => {
    expect(normalizzaTempo({ ore: '', minuti: '90' })).toEqual({ ore: '1', minuti: '30' })
    expect(normalizzaTempo({ ore: '1', minuti: '75' })).toEqual({ ore: '2', minuti: '15' })
    expect(normalizzaTempo({ ore: '2', minuti: '5' })).toEqual({ ore: '2', minuti: '05' })
  })

  it('con i minuti vuoti non tocca niente', () => {
    expect(normalizzaTempo({ ore: '3', minuti: '' })).toEqual({ ore: '3', minuti: '' })
    expect(normalizzaTempo({ ore: '', minuti: '' })).toEqual({ ore: '', minuti: '' })
  })
})
