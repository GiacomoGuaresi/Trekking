import { describe, expect, it } from 'vitest'
import { formattaViaggio, pulisciViaggio, testoViaggio, viaggioManuale, viaggioValido } from './viaggio'

describe('pulisciViaggio', () => {
  it('legge ore e minuti', () => {
    expect(pulisciViaggio({ ore: '1', minuti: '30' })).toBe(90)
    expect(pulisciViaggio({ ore: '', minuti: '45' })).toBe(45)
    expect(pulisciViaggio({ ore: '0', minuti: '00' })).toBe(0)
  })

  it('i campi vuoti vogliono dire niente tempo', () => {
    expect(pulisciViaggio({ ore: '', minuti: '' })).toBeNull()
  })
})

describe('viaggioValido', () => {
  it('i campi vuoti vanno bene: il tempo non è obbligatorio', () => {
    expect(viaggioValido({ ore: '', minuti: '' })).toBe(true)
  })

  it('un campo storto ferma il salvataggio', () => {
    expect(viaggioValido({ ore: 'due', minuti: '' })).toBe(false)
    expect(viaggioValido({ ore: '1', minuti: '30' })).toBe(true)
  })
})

describe('formattaViaggio', () => {
  it('scrive le ore e i minuti', () => {
    expect(formattaViaggio(85)).toBe('1 h 25')
    expect(formattaViaggio(120)).toBe('2 h')
    expect(formattaViaggio(45)).toBe('45 min')
  })

  it('senza tempo mette il trattino', () => {
    expect(formattaViaggio(null)).toBe('—')
  })
})

describe('testoViaggio', () => {
  it('riporta nel campo i minuti salvati', () => {
    expect(testoViaggio(85)).toEqual({ ore: '1', minuti: '25' })
    expect(testoViaggio(null)).toEqual({ ore: '', minuti: '' })
  })
})

describe('viaggioManuale', () => {
  it('su un trekking nuovo il tempo scritto è manuale', () => {
    expect(viaggioManuale(90, null)).toBe(true)
  })

  it('chi cambia il valore se lo tiene', () => {
    expect(viaggioManuale(90, { viaggio_minuti: 75, viaggio_manuale: false })).toBe(true)
  })

  it('chi non tocca il campo lascia le cose come stavano', () => {
    expect(viaggioManuale(75, { viaggio_minuti: 75, viaggio_manuale: false })).toBe(false)
    expect(viaggioManuale(75, { viaggio_minuti: 75, viaggio_manuale: true })).toBe(true)
  })

  it('svuotando il campo torna automatico', () => {
    expect(viaggioManuale(null, { viaggio_minuti: 75, viaggio_manuale: true })).toBe(false)
  })
})
