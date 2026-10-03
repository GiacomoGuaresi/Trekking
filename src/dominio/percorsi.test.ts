import { describe, expect, it } from 'vitest'
import { esempio } from './esempi'
import { daCalcolare, daOpenRouteService, mancanti } from './percorsi'

describe('daCalcolare', () => {
  it('vuole le coordinate, nessun tempo e nessun tempo scritto a mano', () => {
    expect(daCalcolare(esempio({ lat: 46, lon: 10 }))).toBe(true)
    expect(daCalcolare(esempio())).toBe(false)
    expect(daCalcolare(esempio({ lat: 46, lon: 10, viaggio_minuti: 80 }))).toBe(false)
    expect(daCalcolare(esempio({ lat: 46, lon: 10, viaggio_manuale: true }))).toBe(false)
  })

  it('conta anche i completati', () => {
    const elenco = [esempio({ lat: 46, lon: 10, completato: true }), esempio({ luogo_nome: 'Solo nome' })]
    expect(mancanti(elenco)).toEqual([elenco[0]])
  })
})

describe('daOpenRouteService', () => {
  it('trasforma i secondi in minuti arrotondati', () => {
    expect(daOpenRouteService(200, { routes: [{ summary: { duration: 5130 } }] })).toEqual({ esito: 'minuti', minuti: 86 })
  })

  it('senza durata il viaggio è di zero minuti', () => {
    expect(daOpenRouteService(200, { routes: [{ summary: {} }] })).toEqual({ esito: 'minuti', minuti: 0 })
  })

  it('percorso non trovato, troppo lungo o lontano dalle strade: impossibile', () => {
    for (const code of [2004, 2009, 2010]) {
      expect(daOpenRouteService(404, { error: { code, message: '…' } })).toEqual({ esito: 'impossibile' })
    }
  })

  it('chiave, quota, server e risposte strane: si riprova più tardi', () => {
    expect(daOpenRouteService(403, { error: 'Access to this API has been disallowed' })).toEqual({ esito: 'irraggiungibile' })
    expect(daOpenRouteService(429, { error: 'Rate limit exceeded' })).toEqual({ esito: 'irraggiungibile' })
    expect(daOpenRouteService(500, { error: { code: 2099 } })).toEqual({ esito: 'irraggiungibile' })
    expect(daOpenRouteService(502, null)).toEqual({ esito: 'irraggiungibile' })
    expect(daOpenRouteService(200, { routes: [{ summary: { duration: 'tanto' } }] })).toEqual({ esito: 'irraggiungibile' })
  })
})
