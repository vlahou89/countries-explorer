<script setup lang="ts">
import type { CountrySummary } from '~/types/country'
import BaseButton from '~/components/BaseButton/index.vue'
import IconChevron from '~/assets/icons/chevron-down.svg'

export type SortKey = 'name' | 'currency' | 'region' | 'population'
export type SortDirection = 'asc' | 'desc'

// One row per country, plus a loading skeleton and a sort toggle per column.
const props = withDefaults(defineProps<{
  countries: CountrySummary[]
  loading?: boolean
  sortKey?: SortKey | null
  sortDirection?: SortDirection
  pageSize?: number
}>(), { loading: false, sortKey: null, sortDirection: 'asc', pageSize: 9 })
const emit = defineEmits<{ sort: [SortKey] }>()

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'currency', label: 'Currency' },
  { key: 'region', label: 'Region' },
  { key: 'population', label: 'Population' },
]

// aria-sort tells assistive tech which column is active, and in which direction.
function ariaSort(key: SortKey): 'none' | 'ascending' | 'descending' {
  if (props.sortKey !== key) return 'none'
  return props.sortDirection === 'asc' ? 'ascending' : 'descending'
}

// Per-cell border classes fake a rounded outer border on a <table>, since border-separate can't round itself.
function edgeClass(rowIndex: number, rowCount: number, col: 'first' | 'middle' | 'last'): string {
  const isFirstRow = rowIndex === 0
  const isLastRow = rowIndex === rowCount - 1
  const classes = ['border-lightgrey', 'border-b', isFirstRow ? 'border-t' : '']
  if (col === 'first') {
    classes.push('border-l')
    if (isFirstRow) classes.push('rounded-tl-xl')
    if (isLastRow) classes.push('rounded-bl-xl')
  } else if (col === 'last') {
    classes.push('border-r')
    if (isFirstRow) classes.push('rounded-tr-xl')
    if (isLastRow) classes.push('rounded-br-xl')
  }
  return classes.join(' ')
}
</script>

<template>
  <div class="countries-table-card">
    <table class="countries-table" :aria-busy="loading">
      <caption v-if="loading" class="sr-only">Loading countries…</caption>
      <colgroup>
        <col class="w-[17%]">
        <col class="w-[21%]">
        <col class="w-[21%]">
        <col class="w-[22%]">
        <col class="w-[19%]">
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="col in COLUMNS"
            :key="col.key"
            class="countries-table-head-cell"
            :aria-sort="ariaSort(col.key)"
          >
            <button
              type="button"
              :aria-label="`Sort by ${col.label}`"
              class="countries-table-sort-btn"
              @click="emit('sort', col.key)"
            >
              <span class="sm:hidden">{{ col.label.slice(0, 6) }}</span>
              <span class="hidden sm:inline">{{ col.label }}</span>
              <IconChevron
                class="shrink-0 transition-transform"
                :class="[
                  sortKey === col.key && sortDirection === 'asc' ? 'rotate-180' : '',
                  sortKey === col.key ? 'text-[#2B2B2B]' : 'text-[#9AA0AE]',
                ]"
              />
            </button>
          </th>
          <th class="countries-table-head-cell"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="(i, rowIndex) in pageSize" :key="i" class="countries-table-row">
            <td
              v-for="(col, colIndex) in COLUMNS"
              :key="col.key"
              class="countries-table-cell"
              :class="edgeClass(rowIndex, pageSize, colIndex === 0 ? 'first' : 'middle')"
            >
              <span class="skeleton-bar" aria-hidden="true" />
            </td>
            <td class="countries-table-cell--actions" :class="edgeClass(rowIndex, pageSize, 'last')">
              <BaseButton variant="outline" disabled>Open</BaseButton>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(c, rowIndex) in countries" :key="c.id" class="countries-table-row">
            <td class="countries-table-cell" :class="edgeClass(rowIndex, countries.length, 'first')">{{ c.name }}</td>
            <td class="countries-table-cell" :class="edgeClass(rowIndex, countries.length, 'middle')">{{ c.currency }}</td>
            <td class="countries-table-cell" :class="edgeClass(rowIndex, countries.length, 'middle')">{{ c.region }}</td>
            <td class="countries-table-cell" :class="edgeClass(rowIndex, countries.length, 'middle')">{{ c.population }}</td>
            <td class="countries-table-cell--actions" :class="edgeClass(rowIndex, countries.length, 'last')">
              <BaseButton
                variant="outline"
                :aria-label="`Open ${c.name}`"
                @click="navigateTo(`/country/${c.id}`)"
              >
                Open
              </BaseButton>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
