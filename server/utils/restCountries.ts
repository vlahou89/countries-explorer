// Countries data comes from REST Countries v5, paginated 100 records at a time.
const BASE_URL = 'https://api.restcountries.com/countries/v5'
const RESPONSE_FIELDS = 'names.common,names.official,names.native,codes.alpha_3,capitals,flag.url_svg,flag.url_png,flag.description,region,subregion,coordinates,timezones,population,currencies,languages,classification.un_member,classification.sovereign,links.google_maps'
const PAGE_SIZE = 100

// Authenticated fetch: attaches the API key, and turns an API-level error into a Nuxt error.
async function callRestCountries(path: string, query: Record<string, string | number>) {
  const apiKey = useRuntimeConfig().restCountriesApiKey
  if (!apiKey) throw createError({ statusCode: 500, statusMessage: 'REST Countries API key is not configured (set NUXT_REST_COUNTRIES_API_KEY).' })

  const res = await $fetch<{ data?: { objects?: unknown[]; meta?: { more?: boolean } }; errors?: { message: string }[] }>(`${BASE_URL}${path}`, { query: { ...query, response_fields: RESPONSE_FIELDS }, headers: { Authorization: `Bearer ${apiKey}` } })
  if (res.errors?.length) throw createError({ statusCode: 502, statusMessage: res.errors[0]!.message })
  return { objects: res.data?.objects ?? [], more: res.data?.meta?.more ?? false }
}

// Keep fetching pages until the API says there's no more.
export async function fetchAllCountries() {
  const all: unknown[] = []
  let offset = 0, more = true
  while (more) {
    const page = await callRestCountries('', { limit: PAGE_SIZE, offset })
    all.push(...page.objects)
    more = page.more
    offset += PAGE_SIZE
  }
  return all
}

// One country lookup: 2-letter codes use alpha_2, everything else uses alpha_3.
export async function fetchCountryByCode(code: string) {
  const property = code.length === 2 ? 'codes.alpha_2' : 'codes.alpha_3'
  const { objects: [country] } = await callRestCountries(`/${property}/${code}`, {})
  return country
}
