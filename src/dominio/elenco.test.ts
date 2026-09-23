import { describe, expect, it } from 'vitest'
import { quantiCompletati, rimuovi, sostituisci, visibili } from './elenco'
import type { Trekking } from './tipi'

function trekking(id: string, nome: string, completato = false): Trekking {
  return { id, nome, completato, creato_il: '2026-09-23T10:00:00Z', modificato_il: '2026-09-23T10:00:00Z' }
}

const elenco = [trekking('1', 'Cima Tosa'), trekking('2', 'Monte Baldo'), trekking('3', 'Città Morta')]

describe('sostituisci', () => {
  it('cambia solo il trekking con quel codice e lascia l’ordine com’è', () => {
    const dopo = sostituisci(elenco, trekking('2', 'Monte Baldo dalla Ferrara'))
    expect(dopo.map((t) => t.nome)).toEqual(['Cima Tosa', 'Monte Baldo dalla Ferrara', 'Città Morta'])
  })

  it('non cambia nulla se quel codice non c’è', () => {
    expect(sostituisci(elenco, trekking('9', 'Sconosciuto'))).toEqual(elenco)
  })
})

describe('rimuovi', () => {
  it('toglie il trekking eliminato', () => {
    expect(rimuovi(elenco, '1').map((t) => t.id)).toEqual(['2', '3'])
  })

  it('non cambia nulla se quel codice non c’è', () => {
    expect(rimuovi(elenco, '9')).toEqual(elenco)
  })
})

const conCompletati = [trekking('1', 'Cima Tosa'), trekking('2', 'Monte Baldo', true), trekking('3', 'Città Morta')]

describe('visibili', () => {
  it('nasconde i completati', () => {
    expect(visibili(conCompletati, false).map((t) => t.id)).toEqual(['1', '3'])
  })

  it('con "Mostra completati" li tiene tutti, nello stesso ordine', () => {
    expect(visibili(conCompletati, true).map((t) => t.id)).toEqual(['1', '2', '3'])
  })
})

describe('quantiCompletati', () => {
  it('conta i completati', () => {
    expect(quantiCompletati(conCompletati)).toBe(1)
    expect(quantiCompletati(elenco)).toBe(0)
  })
})
