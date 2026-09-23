import { describe, expect, it } from 'vitest'
import { rimuovi, sostituisci } from './elenco'
import type { Trekking } from './tipi'

function trekking(id: string, nome: string): Trekking {
  return { id, nome, creato_il: '2026-09-23T10:00:00Z', modificato_il: '2026-09-23T10:00:00Z' }
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
