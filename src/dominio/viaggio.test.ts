import { describe, expect, it } from 'vitest'
import { formattaViaggio, pulisciViaggio, testoViaggio, viaggioManuale, viaggioValido } from './viaggio'

describe('pulisciViaggio', () => {
  it('legge i minuti', () => {
    expect(pulisciViaggio('90')).toBe(90)
    expect(pulisciViaggio(' 45 ')).toBe(45)
  })

  it('legge anche ore e minuti', () => {
    expect(pulisciViaggio('1:30')).toBe(90)
    expect(pulisciViaggio('2:05')).toBe(125)
  })

  it('il campo vuoto vuol dire niente tempo', () => {
    expect(pulisciViaggio('')).toBeNull()
  })

  it('rifiuta i minuti oltre il cinquantanove e quello che non è un numero', () => {
    expect(pulisciViaggio('1:70')).toBeNull()
    expect(pulisciViaggio('-30')).toBeNull()
    expect(pulisciViaggio('un’ora')).toBeNull()
    expect(pulisciViaggio('90.5')).toBeNull()
  })
})

describe('viaggioValido', () => {
  it('il campo vuoto va bene: il tempo non è obbligatorio', () => {
    expect(viaggioValido('')).toBe(true)
  })

  it('un campo storto ferma il salvataggio', () => {
    expect(viaggioValido('due ore')).toBe(false)
    expect(viaggioValido('1:30')).toBe(true)
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
    expect(testoViaggio(85)).toBe('85')
    expect(testoViaggio(null)).toBe('')
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
