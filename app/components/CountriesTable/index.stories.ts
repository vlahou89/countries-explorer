import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CountriesTable from './index.vue'
import type { CountrySummary } from '~/types/country'

const COUNTRIES: CountrySummary[] = [
  {
    id: 'JPN', name: 'Japan', flagSvg: '', flagAlt: 'Flag of Japan',
    region: 'Asia', population: 125_836_021, currency: 'Japanese yen',
    currencies: [{ code: 'JPY', name: 'Japanese yen', symbol: '¥' }], languages: ['Japanese'],
  },
  {
    id: 'FRA', name: 'France', flagSvg: '', flagAlt: 'Flag of France',
    region: 'Europe', population: 68_170_000, currency: 'Euro',
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }], languages: ['French'],
  },
  {
    id: 'BRA', name: 'Brazil', flagSvg: '', flagAlt: 'Flag of Brazil',
    region: 'Americas', population: 214_300_000, currency: 'Brazilian real',
    currencies: [{ code: 'BRL', name: 'Brazilian real', symbol: 'R$' }], languages: ['Portuguese'],
  },
]

const meta: Meta<typeof CountriesTable> = {
  title: 'CountriesTable',
  component: CountriesTable,
  tags: ['autodocs'],
  args: {
    countries: COUNTRIES,
    loading: false,
    sortKey: null,
    sortDirection: 'asc',
    pageSize: 9,
  },
}

export default meta
type Story = StoryObj<typeof CountriesTable>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true, countries: [] },
}

export const Empty: Story = {
  args: { countries: [] },
}

export const SortedByPopulationDescending: Story = {
  args: { sortKey: 'population', sortDirection: 'desc' },
}

export const SortedByNameAscending: Story = {
  args: { sortKey: 'name', sortDirection: 'asc' },
}
