export interface Currency { code: string; name: string; symbol: string }

export interface CountrySummary {
  id: string
  name: string
  flagSvg: string
  flagAlt: string
  region: string
  population: number
  currency: string
  currencies: Currency[]
  languages: string[]
}

export interface CountryDetails extends CountrySummary {
  official: string
  nativeNames: string[]
  capital: string
  subregion: string
  latlng: [number, number]
  timezones: string[]
  utcOffsetMinutes: number
  unMember: boolean
  independent: boolean
  googleMapsUrl: string
}