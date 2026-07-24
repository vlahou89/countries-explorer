import { describe, it, expect } from 'vitest'
import { mapSummary, mapDetails, parseUtcOffset } from './country.mapper'
import type { RestCountry } from '../types/rest-countries'

const japan: RestCountry = {
  names: { common: 'Japan', official: 'Japan', native: { jpn: { common: '日本', official: '日本国' } } },
  codes: { alpha_3: 'JPN' },
  currencies: [{ code: 'JPY', name: 'Japanese yen', symbol: '¥' }],
  languages: [{ name: 'Japanese' }],
  capitals: [{ name: 'Tokyo' }], region: 'Asia', subregion: 'Eastern Asia',
  population: 125836021, coordinates: { lat: 36, lng: 138 },
  timezones: ['UTC+09:00'], classification: { un_member: true, sovereign: true },
  flag: { url_svg: 'jp.svg', description: 'Flag of Japan' }, links: { google_maps: 'https://maps' },
}

describe('parseUtcOffset', () => {
  it.each([
    ['UTC+09:00', 540],
    ['UTC-03:30', -210],
    ['UTC+05:45', 345],
    ['UTC', 0],
    ['nonsense', 0],
    [undefined, 0],
  ])('parses %s to %i minutes', (input, expected) => {
    expect(parseUtcOffset(input as string)).toBe(expected)
  })
})

describe('mapSummary', () => {
  it('carries through the currencies and languages arrays', () => {
    const c = mapSummary(japan)
    expect(c.currencies).toEqual([{ code: 'JPY', name: 'Japanese yen', symbol: '¥' }])
    expect(c.languages).toEqual(['Japanese'])
    expect(c.currency).toBe('Japanese yen')
  })

  it('falls back to a written alt when the API omits one', () => {
    const noAlt = { ...japan, flag: { url_svg: 'jp.svg' } }
    expect(mapSummary(noAlt).flagAlt).toBe('Flag of Japan')
  })

  it('survives a record with no currencies or languages', () => {
    const antarctica: RestCountry = {
      names: { common: 'Antarctica', official: 'Antarctica' },
      codes: { alpha_3: 'ATA' }, region: 'Antarctic', population: 1000,
    }
    const c = mapSummary(antarctica)
    expect(c.currencies).toEqual([])
    expect(c.currency).toBe('—')
    expect(c.population).toBe(1000)
  })
})

describe('mapDetails', () => {
  it('joins capitals and derives the utc offset', () => {
    const c = mapDetails(japan)
    expect(c.capital).toBe('Tokyo')
    expect(c.utcOffsetMinutes).toBe(540)
    expect(c.nativeNames).toEqual(['日本'])
  })

  it('reports an em dash for a country with no capital', () => {
    const c = mapDetails({ names: { common: 'Antarctica', official: 'Antarctica' }, codes: { alpha_3: 'ATA' } })
    expect(c.capital).toBe('—')
    expect(c.latlng).toEqual([0, 0])
  })

  it('de-duplicates native names across languages', () => {
    const ch: RestCountry = {
      names: {
        common: 'Switzerland', official: 'Swiss Confederation',
        native: { deu: { common: 'Schweiz', official: 'x' }, fra: { common: 'Suisse', official: 'y' }, gsw: { common: 'Schweiz', official: 'z' } },
      },
      codes: { alpha_3: 'CHE' },
    }
    expect(mapDetails(ch).nativeNames).toEqual(['Schweiz', 'Suisse'])
  })
})
