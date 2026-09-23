import { describe, expect, it } from 'vitest'
import { esempio } from './esempi'
import { FILTRI_VUOTI, dentro, filtra, limite, quantiFiltri, testoLimite } from './filtri'

const elenco = [
  esempio({ id: '1', nome: 'Passeggiata', dislivello: 200 }),
  esempio({ id: '2', nome: 'Cima lunga', dislivello: 1400 }),
  esempio({ id: '3', nome: 'Senza dettagli' }),
]

describe('filtra', () => {
  it('senza limiti li tiene tutti', () => {
    expect(filtra(elenco, FILTRI_VUOTI).map((t) => t.id)).toEqual(['1', '2', '3'])
  })

  it('tiene chi sta nell’intervallo', () => {
    expect(filtra(elenco, { dislivello: { min: 500, max: null } }).map((t) => t.id)).toEqual(['2', '3'])
    expect(filtra(elenco, { dislivello: { min: null, max: 500 } }).map((t) => t.id)).toEqual(['1', '3'])
    expect(filtra(elenco, { dislivello: { min: 100, max: 300 } }).map((t) => t.id)).toEqual(['1', '3'])
  })

  it('chi non ha il dislivello resta sempre visibile', () => {
    expect(filtra(elenco, { dislivello: { min: 3000, max: 4000 } }).map((t) => t.id)).toEqual(['3'])
  })

  it('i limiti sono compresi', () => {
    expect(dentro(200, { min: 200, max: 200 })).toBe(true)
    expect(dentro(null, { min: 200, max: 300 })).toBe(true)
  })
})

describe('limite', () => {
  it('legge il numero scritto nel campo', () => {
    expect(limite('500')).toBe(500)
    expect(limite('0')).toBe(0)
  })

  it('vuoto o storto vuol dire nessun limite', () => {
    expect(limite('')).toBeNull()
    expect(limite('poco')).toBeNull()
    expect(limite('-100')).toBeNull()
  })

  it('riporta nel campo il limite acceso', () => {
    expect(testoLimite(500)).toBe('500')
    expect(testoLimite(null)).toBe('')
  })
})

describe('quantiFiltri', () => {
  it('conta i limiti accesi', () => {
    expect(quantiFiltri(FILTRI_VUOTI)).toBe(0)
    expect(quantiFiltri({ dislivello: { min: 500, max: null } })).toBe(1)
    expect(quantiFiltri({ dislivello: { min: 500, max: 900 } })).toBe(2)
  })
})
