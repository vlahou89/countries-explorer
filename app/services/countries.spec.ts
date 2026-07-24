import { describe, it, expect, vi, afterEach } from 'vitest'
import { getCountries, getCountry } from './countries'
import { ApiError } from './api'

const japan = {
  names: { common: 'Japan', official: 'Japan' },
  codes: { alpha_3: 'JPN' }, region: 'Asia', population: 125_836_021,
  currencies: [{ code: 'JPY', name: 'Japanese yen', symbol: '¥' }],
  languages: [{ name: 'Japanese' }],
  capitals: [{ name: 'Tokyo' }], timezones: ['UTC+09:00'], coordinates: { lat: 36, lng: 138 },
}

function stubFetch(impl: (path: string, opts: { query?: Record<string, string> }) => unknown) {
  vi.stubGlobal('$fetch', vi.fn(impl))
}

afterEach(() => vi.unstubAllGlobals())

describe('getCountries', () => {
  it('calls our own server route, not restcountries.com directly', async () => {
    let calledUrl = ''
    stubFetch((p) => { calledUrl = p; return [japan] })
    await getCountries()
    expect(calledUrl).toBe('/api/countries')
  })

  it('returns mapped domain models, not the raw shape', async () => {
    stubFetch(() => [japan])
    const [c] = await getCountries()
    expect(c).toMatchObject({ id: 'JPN', currency: 'Japanese yen' })
    expect(c).not.toHaveProperty('codes')
  })

  it('drops records with no cca3, which cannot be keyed or routed to', async () => {
    stubFetch(() => [japan, { names: { common: 'Ghost', official: 'Ghost' }, codes: {} }])
    expect(await getCountries()).toHaveLength(1)
  })

  it('rejects with an ApiError when the request fails', async () => {
    stubFetch(() => { throw Object.assign(new Error('fail'), { status: 500 }) })
    await expect(getCountries()).rejects.toBeInstanceOf(ApiError)
  })

  it('rejects with an ApiError when the response is not an array', async () => {
    stubFetch(() => ({ success: false }))
    await expect(getCountries()).rejects.toBeInstanceOf(ApiError)
  })
})

describe('getCountry', () => {
  it('requests the country by uppercased code from our server route', async () => {
    let calledUrl = ''
    stubFetch((p) => { calledUrl = p; return japan })
    await getCountry('jpn')
    expect(calledUrl).toBe('/api/countries/JPN')
  })

  it('returns the mapped details', async () => {
    stubFetch(() => japan)
    expect((await getCountry('JPN')).name).toBe('Japan')
  })

  it('rejects with an ApiError when the request fails', async () => {
    stubFetch(() => { throw Object.assign(new Error('fail'), { status: 500 }) })
    await expect(getCountry('JPN')).rejects.toBeInstanceOf(ApiError)
  })

  it('propagates a not-found ApiError from the server route', async () => {
    stubFetch(() => { throw Object.assign(new Error('fail'), { status: 404 }) })
    await expect(getCountry('ZZZ')).rejects.toMatchObject({ kind: 'not-found' })
  })
})
