import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getCountries } from '~/services/countries'
import type { CountrySummary } from '~/types/country'
import type { ApiError } from '~/services/api'
import type { SortDirection, SortKey } from '~/components/CountriesTable/index.vue'

export type FilterKey = 'name' | 'currency' | 'region' | 'language'
export interface AppliedFilter { key: FilterKey; keyLabel: string; value: string }

const PAGE_SIZE = 9

// Setup-store syntax: a function body using ref/computed instead of an
// options object. Same Composition API mental model as a component's
// <script setup>, which is why it composes so easily with the rest of Vue.
export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<CountrySummary[]>([])
  const pending = ref(false)
  const error = ref<ApiError | null>(null)

  // Standard async loading pattern: flip pending on, clear any stale error,
  // await the request, and always flip pending off in `finally` so a thrown
  // error can't leave the UI stuck in a loading state.
  async function fetchCountries() {
    pending.value = true
    error.value = null
    try {
      countries.value = await getCountries()
    } catch (e) {
      // Store a plain object, not the ApiError class instance. Nuxt has to
      // serialize store state into the SSR payload, and its serializer
      // (devalue) can't reconstruct arbitrary class instances on the client.
      const err = e as ApiError
      error.value = { kind: err.kind, userMessage: err.userMessage, status: err.status } as ApiError
    } finally {
      pending.value = false
    }
  }

  const populationLow = ref<string | null>(null)
  const populationHigh = ref<string | null>(null)
  const search = ref<string | null>(null)
  // Free-form key/value filters the user builds up one at a time (e.g.
  // "Region: Europe"), on top of the population range and search above.
  const appliedFilters = ref<AppliedFilter[]>([])

  function addFilter(key: FilterKey, keyLabel: string, value: string) {
    appliedFilters.value.push({ key, keyLabel, value })
  }

  function removeFilter(index: number) {
    appliedFilters.value.splice(index, 1)
  }

  // `computed` = derived, cached state: Vue tracks every ref it reads here
  // (countries, populationLow/High, search, appliedFilters) and only
  // re-runs this function when one of them actually changes, components
  // never need to manually recompute or re-fetch when a filter changes.
  const filteredCountries = computed(() => {
    const low = populationLow.value ? Number(populationLow.value) : null
    const high = populationHigh.value ? Number(populationHigh.value) : null
    const searchTerm = search.value?.trim().toLowerCase() ?? ''

    return countries.value.filter((c) => {
      if (low !== null && c.population < low) return false
      if (high !== null && c.population > high) return false
      if (searchTerm) {
        // Search checks several fields at once by mashing them into one
        // string, rather than branching per-field.
        const haystack = `${c.name} ${c.currency} ${c.region} ${c.population}`.toLowerCase()
        if (!haystack.includes(searchTerm)) return false
      }

      // .every() = AND across all applied filters: a country must match
      // every chip, not just one, to stay in the results.
      return appliedFilters.value.every((f) => {
        const term = f.value.toLowerCase()
        if (f.key === 'language') return c.languages.some(l => l.toLowerCase().includes(term))
        return c[f.key].toLowerCase().includes(term)
      })
    })
  })

  const sortKey = ref<SortKey | null>(null)
  const sortDirection = ref<SortDirection>('asc')

  // Clicking the same column again flips direction; clicking a new column
  // starts it fresh at ascending. Same toggle pattern as most data tables.
  function onSort(key: SortKey) {
    if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    else { sortKey.value = key; sortDirection.value = 'asc' }
  }

  // Sorting is layered on top of filtering (reads filteredCountries, not
  // countries directly) , this three-stage pipeline, filter -> sort ->
  // paginate, is what keeps each computed simple and single-purpose.
  const sortedCountries = computed(() => {
    const key = sortKey.value
    if (!key) return filteredCountries.value
    const dir = sortDirection.value === 'asc' ? 1 : -1
    // [...array].sort() copies first , Array#sort mutates in place, and
    // mutating a computed's source would trigger Vue reactivity loops.
    return [...filteredCountries.value].sort((a, b) => {
      if (key === 'population') return (a.population - b.population) * dir
      return a[key].localeCompare(b[key]) * dir
    })
  })

  const page = ref(1)
  const pageCount = computed(() => Math.max(1, Math.ceil(sortedCountries.value.length / PAGE_SIZE)))
  const shown = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return sortedCountries.value.slice(start, start + PAGE_SIZE)
  })

  // Guards against a stranded page: if a filter shrinks the results so the
  // current page no longer exists (e.g. you're on page 5 and a filter
  // leaves only 2 pages), snap back to page 1 instead of showing nothing.
  watch(filteredCountries, () => { if (page.value > pageCount.value) page.value = 1 })

  // Everything returned here is the store's public API , anything not
  // returned (like PAGE_SIZE itself) stays private to this file.
  return {
    countries,
    pending,
    error,
    fetchCountries,
    populationLow,
    populationHigh,
    search,
    appliedFilters,
    addFilter,
    removeFilter,
    filteredCountries,
    sortKey,
    sortDirection,
    onSort,
    page,
    pageCount,
    shown,
    pageSize: PAGE_SIZE,
  }
})
