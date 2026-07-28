import type { RestCountry } from '../types/rest-countries'
import type { CountrySummary, CountryDetails } from '../types/country'

// "UTC+05:45" -> 345, "UTC-03:30" -> -210. Anything unrecognised is treated as UTC+0.
export function parseUtcOffset(tz: string | undefined): number {
  const m = /^UTC([+-])(\d{2}):(\d{2})$/.exec((tz ?? '').trim())
  if (!m) return 0
  const minutes = Number(m[2]) * 60 + Number(m[3])
  return m[1] === '-' ? -minutes : minutes
}

// Fields shown in the countries list/table. Every raw field is optional, so each one falls back to a safe default.
export function mapSummary(raw: RestCountry): CountrySummary {
  const currencies = raw.currencies ?? []
  const name = raw.names?.common ?? 'Unknown'
  return {
    id: raw.codes?.alpha_3 ?? '',
    name,
    flagSvg: raw.flag?.url_svg ?? raw.flag?.url_png ?? '',
    flagAlt: raw.flag?.description || `Flag of ${name}`,
    region: raw.region ?? 'Unknown',
    population: raw.population ?? 0,
    currencies,
    languages: (raw.languages ?? []).map(l => l.name),
    currency: currencies[0]?.name ?? '—',
  }
}

// Everything from mapSummary, plus the extra fields shown on a country's detail page.
export function mapDetails(raw: RestCountry): CountryDetails {
  const timezones = raw.timezones ?? []
  // Native names can repeat across languages (e.g. Swiss German and German both say "Schweiz"), so dedupe them.
  const nativeNames = Object.values(raw.names?.native ?? {}).map(n => n?.common).filter((n): n is string => Boolean(n))

  return {
    ...mapSummary(raw),
    official: raw.names?.official ?? raw.names?.common ?? 'Unknown',
    nativeNames: [...new Set(nativeNames)],
    capital: raw.capitals?.map(c => c.name).join(' · ') || '—',
    subregion: raw.subregion || '—',
    latlng: raw.coordinates ? [raw.coordinates.lat, raw.coordinates.lng] : [0, 0],
    timezones,
    utcOffsetMinutes: parseUtcOffset(timezones[0]),
    unMember: raw.classification?.un_member ?? false,
    independent: raw.classification?.sovereign ?? false,
    googleMapsUrl: raw.links?.google_maps ?? '',
  }
}
