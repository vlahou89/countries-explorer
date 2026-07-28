import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { getCountries } from '~/services/countries'
import type { CountrySummary } from '~/types/country'
import type { ApiError } from '~/services/api'
import type { SortDirection, SortKey } from '~/components/CountriesTable/index.vue'

export type FilterKey = 'name' | 'currency' | 'region' | 'language'
export interface AppliedFilter { key: FilterKey; keyLabel: string; value: string }

const PAGE_SIZE = 9

// Setup store: a plain function using ref/computed, same mental model as <script setup>.
export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<CountrySummary[]>([])
  const pending = ref(false)
  const error = ref<ApiError | null>(null)

  // Load pattern: pending on, clear old error, fetch, pending off no matter what.
  async function fetchCountries() {
    pending.value = true
    error.value = null
    try {
      countries.value = await getCountries()
    } catch (e) {
      // Copy into a plain object: Nuxt's SSR payload can't serialize a class instance.
      const err = e as ApiError
      error.value = { kind: err.kind, userMessage: err.userMessage, status: err.status } as ApiError
    } finally {
      pending.value = false
    }
  }

  const populationLow = ref<string | null>(null)
  const populationHigh = ref<string | null>(null)
  const search = ref<string | null>(null)
  
  // Chips the user adds one at a time, e.g. "Region: Europe".
  const appliedFilters = ref<AppliedFilter[]>([])

  function addFilter(key: FilterKey, keyLabel: string, value: string) {
    appliedFilters.value.push({ key, keyLabel, value })
  }

  function removeFilter(index: number) {
    appliedFilters.value.splice(index, 1)
  }

  // Population range: no low/high means no limit on that side.
  function matchesPopulation(c: CountrySummary): boolean {
    const low = populationLow.value ? Number(populationLow.value) : null
    const high = populationHigh.value ? Number(populationHigh.value) : null
    return (low === null || c.population >= low) && (high === null || c.population <= high)
  }

  // Chips are AND'd: a country must match every chip, not just one.
  function matchesFilters(c: CountrySummary): boolean {
    return appliedFilters.value.every((f) => {
      const term = f.value.toLowerCase()
      if (f.key === 'language') return c.languages.some(l => l.toLowerCase().includes(term))
      return c[f.key].toLowerCase().includes(term)
    })
  }

  // Free-text search: one string made of every searchable field.
  function matchesSearch(c: CountrySummary): boolean {
    const term = search.value?.trim().toLowerCase()
    if (!term) return true
    return `${c.name} ${c.currency} ${c.region} ${c.population}`.toLowerCase().includes(term)
  }

  // Derived state: recomputes only when countries/filters actually change.
  // The 3 checks are independent and ANDed together: a country must pass all of them.
  // && short-circuits left to right, so a country that fails matchesPopulation never
  // even runs matchesSearch/matchesFilters. Adding more chips only makes matchesFilters
  // do more work (it loops appliedFilters), it never changes what matchesPopulation does.
  const filteredCountries = computed(() => countries.value.filter(c => (
    matchesPopulation(c) && matchesSearch(c) && matchesFilters(c)
  )))

  const sortKey = ref<SortKey | null>(null)
  const sortDirection = ref<SortDirection>('asc')

  // Same column again flips direction; a new column starts fresh at ascending.
  function onSort(key: SortKey) {
    sortDirection.value = sortKey.value === key && sortDirection.value === 'asc' ? 'desc' : 'asc'
    sortKey.value = key
  }

  // How two countries compare on the chosen column, direction aside.
  function compareByKey(a: CountrySummary, b: CountrySummary, key: SortKey): number {
    if (key === 'population') return a.population - b.population
    return a[key].localeCompare(b[key])
  }

  // Sort runs on top of the filtered list; `[...array]` copies it so sort() doesn't mutate the source.
  const sortedCountries = computed(() => {
    const key = sortKey.value
    if (!key) return filteredCountries.value
    const dir = sortDirection.value === 'asc' ? 1 : -1
    return [...filteredCountries.value].sort((a, b) => compareByKey(a, b, key) * dir)
  })

  // The current page's slice of the sorted list, and how many pages that produces.
  // `shown` is the end of the pipeline: filter -> sort -> paginate. This exact array
  // is what pages/index.vue passes straight into <CountriesTable :countries="shown">.
  const page = ref(1)
  const pageCount = computed(() => Math.max(1, Math.ceil(sortedCountries.value.length / PAGE_SIZE)))
  const shown = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return sortedCountries.value.slice(start, start + PAGE_SIZE)
  })

  // If a new filter shrinks the results past the current page, snap back to page 1.
  watch(filteredCountries, () => { if (page.value > pageCount.value) page.value = 1 })

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
