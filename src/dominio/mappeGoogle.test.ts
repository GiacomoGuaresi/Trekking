import { describe, expect, it } from 'vitest'
import { daLinkLungo, linkBreve, linkGoogle, linkLungo } from './mappeGoogle'

const BOBBIO =
  'https://www.google.com/maps/place/29022+Bobbio+PC/data=!4m6!3m5!1s0x4780b02469d3af03:0xc342e8caa4876ec4!7e2!8m2!3d44.7699439!4d9.3860882!18m1!1e1?utm_source=mstt_1&entry=gps'

describe('linkBreve e linkLungo', () => {
  it('riconosce i link di "Condividi"', () => {
    expect(linkBreve('https://maps.app.goo.gl/vn45qW5SUNBQR4nv7')).toBe(true)
    expect(linkBreve(' https://goo.gl/maps/abc ')).toBe(true)
    expect(linkBreve('https://goo.gl/abc')).toBe(false)
    expect(linkBreve('https://maps.app.goo.gl.esempio.it/x')).toBe(false)
  })

  it('riconosce i link lunghi, anche su google.it', () => {
    expect(linkLungo(BOBBIO)).toBe(true)
    expect(linkLungo('https://www.google.it/maps/@45.9,9.8,12z')).toBe(true)
    expect(linkLungo('https://maps.google.com/?q=45.9,9.8')).toBe(true)
    expect(linkLungo('https://www.google.com/search?q=bobbio')).toBe(false)
    expect(linkLungo('https://google.com.esempio.it/maps/x')).toBe(false)
  })

  it('il testo normale non è un link', () => {
    expect(linkGoogle('Rifugio Curò')).toBe(false)
    expect(linkGoogle('45.9876, 9.8765')).toBe(false)
  })
})

describe('daLinkLungo', () => {
  it('prende il segnaposto e il nome senza CAP', () => {
    expect(daLinkLungo(BOBBIO)).toEqual({ lat: 44.7699439, lon: 9.3860882, nome: 'Bobbio PC' })
  })

  it('il segnaposto vale più del centro della mappa', () => {
    const link = 'https://www.google.com/maps/place/Pizzo+Coca/@46.07,10.01,14z/data=!3m1!4b1!4m6!3m5!8m2!3d46.0717!4d10.0133'
    expect(daLinkLungo(link)).toEqual({ lat: 46.0717, lon: 10.0133, nome: 'Pizzo Coca' })
  })

  it('senza segnaposto: q, query o il centro della mappa', () => {
    expect(daLinkLungo('https://maps.google.com/?q=45.9,9.8')).toEqual({ lat: 45.9, lon: 9.8, nome: null })
    expect(daLinkLungo('https://www.google.com/maps/search/?api=1&query=45.9%2C9.8')).toEqual({
      lat: 45.9,
      lon: 9.8,
      nome: null,
    })
    expect(daLinkLungo('https://www.google.com/maps/@45.9,-9.8,12z')).toEqual({ lat: 45.9, lon: -9.8, nome: null })
  })

  it('un posto senza nome non dà le coordinate come nome', () => {
    const link = "https://www.google.com/maps/place/45%C2%B054'00.0%22N+9%C2%B048'00.0%22E/@45.9,9.8,17z/data=!3d45.9!4d9.8"
    expect(daLinkLungo(link)).toEqual({ lat: 45.9, lon: 9.8, nome: null })
  })

  it('link senza punto o con numeri fuori scala: null', () => {
    expect(daLinkLungo('https://www.google.com/maps/place/Bobbio')).toBeNull()
    expect(daLinkLungo('https://www.google.com/maps/@95,9.8,12z')).toBeNull()
    expect(daLinkLungo('Rifugio Curò')).toBeNull()
  })
})
