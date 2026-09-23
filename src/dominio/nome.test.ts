import { describe, expect, it } from 'vitest'
import { nomeValido, pulisciNome } from './nome'

describe('pulisciNome', () => {
  it('toglie gli spazi ai lati e riduce quelli in mezzo', () => {
    expect(pulisciNome('  Sentiero   delle   Bocchette ')).toBe('Sentiero delle Bocchette')
  })

  it('tratta a capo e tabulazioni come spazi', () => {
    expect(pulisciNome('Monte\tBaldo\ndalla Ferrara')).toBe('Monte Baldo dalla Ferrara')
  })

  it('lascia intatto un nome già pulito, accenti compresi', () => {
    expect(pulisciNome('Città Morta')).toBe('Città Morta')
  })
})

describe('nomeValido', () => {
  it('accetta un nome con del testo', () => {
    expect(nomeValido(' Cima Tosa ')).toBe(true)
  })

  it('rifiuta il vuoto e i soli spazi', () => {
    expect(nomeValido('')).toBe(false)
    expect(nomeValido('   \n\t ')).toBe(false)
  })
})
