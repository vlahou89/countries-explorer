export interface RestCountry {
  names: { common: string; official: string; native?: Record<string, { common: string; official: string }> }
  codes: { alpha_3?: string }
  capitals?: { name: string }[]
  flag?: { url_svg?: string; url_png?: string; description?: string }
  region?: string
  subregion?: string
  coordinates?: { lat: number; lng: number }
  timezones?: string[]
  population?: number
  currencies?: { code: string; name: string; symbol: string }[]
  languages?: { name: string }[]
  classification?: { un_member?: boolean; sovereign?: boolean }
  links?: { google_maps?: string }
}
