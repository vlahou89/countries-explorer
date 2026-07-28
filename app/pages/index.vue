<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import BaseSelect from '~/components/BaseSelect/index.vue'
import BaseInput from '~/components/BaseInput/index.vue'
import BaseButton from '~/components/BaseButton/index.vue'
import CountriesTable from '~/components/CountriesTable/index.vue'
import ApiErrorBanner from '~/components/ApiErrorBanner/index.vue'
import Pagination from '~/components/Pagination/index.vue'
import { useCountriesStore, type FilterKey } from '~/stores/countries'
import IconPlus from '~/assets/icons/plus.svg'
import IconClose from '~/assets/icons/close.svg'

// storeToRefs keeps every field reactive when destructured, unlike destructuring the store directly.
const store = useCountriesStore()
const {
  countries,
  pending,
  error,
  populationLow,
  populationHigh,
  search,
  appliedFilters,
  filteredCountries,
  sortKey,
  sortDirection,
  page,
  pageCount,
  shown,
  pageSize,
} = storeToRefs(store)

// Fetches once per page load rather than on every re-render.
await callOnce('countries', () => store.fetchCountries())

// Select options
const FILTER_KEY_OPTIONS: { label: string; value: FilterKey }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Currency', value: 'currency' },
  { label: 'Region', value: 'region' },
  { label: 'Language', value: 'language' },
]
// They hold the in=progress state of the "include" filter inputs, 
// which are only added to the store when the user clicks "Add".  
const filterKey = ref<FilterKey | null>(null)
const filterValue = ref<string | null>(null)

// Add the chip, then clear the inputs ready for the next one.
// Once "Add" is clicked, addFilter() reads both values and 
// pushes a real chip into the store's appliedFilters array 
function addFilter() {
  if (!filterKey.value || !filterValue.value) return
  const keyLabel = FILTER_KEY_OPTIONS.find(o => o.value === filterKey.value)!.label
  store.addFilter(filterKey.value, keyLabel, filterValue.value)
  filterKey.value = null
  filterValue.value = null
}

useHead({ title: 'Countries list' })
</script>

<template>
  <main class="page">
    <h1 class="page-title">Countries list</h1>
    <hr class="page-divider">

    <!-- Population Filters -->
    <section class="filters-section">
      <h2 class="filters-heading">Population</h2>
      <div class="filters-row">
        <BaseInput v-model="populationLow" size="sm" label="Population, low" hide-label placeholder="Low" type="number" />
        <span class="filters-row-hint">to</span>
        <BaseInput v-model="populationHigh" size="sm" label="Population, high" hide-label placeholder="High" type="number" />
      </div>
    </section>

    <!-- Include filters -->
    <section class="filters-section--narrow">
      <h2 class="filters-heading">Include</h2>
      <div class="filters-row--align-end">
        <BaseSelect
          v-model="filterKey"
          label="Key"
          placeholder="Include"
          :options="FILTER_KEY_OPTIONS"
        />
        <BaseInput v-model="filterValue" size="md" label="Value" placeholder="Value" @keydown.enter.prevent="addFilter" />
        <BaseButton variant="primary" :disabled="!filterKey || !filterValue" @click="addFilter">
          <template #icon>
            <IconPlus class="h-3 w-3" />
          </template>
          Add
        </BaseButton>
      </div>

      <ul v-if="appliedFilters.length" class="chip-list" aria-label="Active filters">
        <li
          v-for="(f, i) in appliedFilters"
          :key="`${f.key}-${f.value}-${i}`"
          class="chip"
        >
          <span><span class="chip-key">{{ f.keyLabel }}</span> <span class="capitalize">{{ f.value }}</span></span>
          <button
            type="button"
            class="chip-remove"
            :aria-label="`Remove filter ${f.keyLabel}: ${f.value}`"
            @click="store.removeFilter(i)"
          >
            <IconClose />
          </button>
        </li>
      </ul>
    </section>

    <BaseInput 
          v-model="search" 
          size="md" class="mt-16"  
          label="Search" 
          hide-label 
          placeholder="Search" 
          variant="search" 
    />

    <ApiErrorBanner v-if="error && !pending" :error="error" @retry="store.fetchCountries" />

    <template v-else>
      <CountriesTable
        class="mt-6"
        :countries="shown"
        :loading="pending"
        :sort-key="sortKey"
        :sort-direction="sortDirection"
        :page-size="pageSize"
        @sort="store.onSort"
      />

      <template v-if="!pending">
        <p v-if="!countries.length" class="empty-state">
          Zero records returned. The request succeeded but the response was empty —
          check the <code>RESPONSE_FIELDS</code> list in <code>server/utils/restCountries.ts</code>.
        </p>
        <p v-else-if="!filteredCountries.length" class="empty-state">
          No countries match the current filters.
        </p>
        <Pagination v-else v-model:page="page" class="mt-4" :page-count="pageCount" />
      </template>
    </template>
  </main>
</template>
