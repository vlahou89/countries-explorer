import { apiGet, ApiError } from './api'
import { mapSummary, mapDetails } from '../mappers/country.mapper'
import type { RestCountry } from '../types/rest-countries'
import type { CountrySummary, CountryDetails } from '../types/country'

export async function getCountries(): Promise<CountrySummary[]> {
  const raw = await apiGet<RestCountry[]>('/api/countries')
  if (!Array.isArray(raw)) throw new ApiError('network', 'Unexpected response from the countries service.')
  return raw.map(mapSummary).filter(c => c.id !== '')
}

export async function getCountry(code: string): Promise<CountryDetails> {
  const raw = await apiGet<RestCountry>(`/api/countries/${code.toUpperCase()}`)
  return mapDetails(raw)
}
