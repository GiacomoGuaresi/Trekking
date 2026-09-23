import { describe, expect, it } from 'vitest'
import { cerca, doppione, normalizza } from './ricerca'
import type { Trekking } from './tipi'

function trekking(id: string, nome: string): Trekking {
  return { id, nome, completato: false, creato_il: '2026-09-23T10:00:00Z', modificato_il: '2026-09-23T10:00:00Z' }
}

const elenco = [trekking('1', 'Città Morta'), trekking('2', 'Monte Baldo'), trekking('3', 'Cima Tosa')]

describe('normalizza', () => {
  it('toglie accenti, maiuscole e spazi di troppo', () => {
    expect(normalizza('  Città   Morta ')).toBe('citta morta')
  })
})

describe('cerca', () => {
  it('trova senza badare ad accenti e maiuscole', () => {
    expect(cerca(elenco, 'citta').map((t) => t.id)).toEqual(['1'])
  })

  it('trova anche un pezzo di nome in mezzo', () => {
    expect(cerca(elenco, 'baldo').map((t) => t.id)).toEqual(['2'])
  })

  it('con la ricerca vuota tiene tutti', () => {
    expect(cerca(elenco, '   ')).toHaveLength(3)
  })

  it('se non trova nulla dà un elenco vuoto', () => {
    expect(cerca(elenco, 'ortles')).toEqual([])
  })
})

describe('doppione', () => {
  it('trova il nome già usato, anche scritto diversamente', () => {
    expect(doppione(elenco, ' cima  TOSA ')?.id).toBe('3')
  })

  it('non segnala il trekking che si sta modificando', () => {
    expect(doppione(elenco, 'Cima Tosa', '3')).toBeNull()
  })

  it('con il nome vuoto o nuovo non segnala nulla', () => {
    expect(doppione(elenco, '  ')).toBeNull()
    expect(doppione(elenco, 'Ortles')).toBeNull()
  })
})
