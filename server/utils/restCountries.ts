const BASE_URL = 'https://api.restcountries.com/countries/v5'
const RESPONSE_FIELDS = [
  'names.common', 'names.official', 'names.native',
  'codes.alpha_3',
  'capitals', 'flag.url_svg', 'flag.url_png', 'flag.description',
  'region', 'subregion', 'coordinates', 'timezones', 'population',
  'currencies', 'languages',
  'classification.un_member', 'classification.sovereign',
  'links.google_maps',
].join(',')
const PAGE_SIZE = 100

interface RestCountriesEnvelope {
  data?: { objects?: unknown[]; meta?: { more?: boolean } }
  errors?: { message: string }[]
}

async function callRestCountries(path: string, query: Record<string, string | number>) {
  const apiKey = useRuntimeConfig().restCountriesApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'REST Countries API key is not configured (set NUXT_REST_COUNTRIES_API_KEY).' })
  }

  const res = await $fetch<RestCountriesEnvelope>(`${BASE_URL}${path}`, {
    query: { ...query, response_fields: RESPONSE_FIELDS },
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (res.errors?.length) {
    throw createError({ statusCode: 502, statusMessage: res.errors[0]!.message })
  }

  return { objects: res.data?.objects ?? [], more: res.data?.meta?.more ?? false }
}

function fetchPage(offset: number) {
  return callRestCountries('', { limit: PAGE_SIZE, offset })
}

export async function fetchAllCountries() {
  const [first, second] = await Promise.all([fetchPage(0), fetchPage(PAGE_SIZE)])
  const all = [...first.objects, ...second.objects]

  let more = second.more
  let offset = PAGE_SIZE * 2
  while (more) {
    const page = await fetchPage(offset)
    all.push(...page.objects)
    more = page.more
    offset += PAGE_SIZE
  }
  return all
}

export async function fetchCountryByCode(code: string) {
  const property = code.length === 2 ? 'codes.alpha_2' : 'codes.alpha_3'
  const { objects: [country] } = await callRestCountries(`/${property}/${code}`, {})
  return country
}
