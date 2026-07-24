import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { config } from '@vue/test-utils'
import { axe } from '~/testing/axe'
import CountriesTable from './index.vue'
import type { CountrySummary } from '~/types/country'

config.global.stubs = { NuxtLink: true }

const japan: CountrySummary = {
  id: 'JPN', name: 'Japan', flagSvg: '', flagAlt: 'Flag of Japan',
  region: 'Asia', population: 125_836_021, currency: 'Japanese yen',
  currencies: [], languages: ['Japanese'],
}

describe('CountriesTable', () => {
  it('has no accessibility violations', async () => {
    const w = mount(CountriesTable, { props: { countries: [japan] } })
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('renders a header row plus one row per country', () => {
    const w = mount(CountriesTable, { props: { countries: [japan] } })
    const headers = w.findAll('th').map(th => th.find('span.hidden.sm\\:inline, span.sr-only').text())
    expect(headers).toEqual(['Name', 'Currency', 'Region', 'Population', 'Actions'])
    expect(w.findAll('tbody tr')).toHaveLength(1)
  })

  it('shows name, currency, region and population for each country', () => {
    const w = mount(CountriesTable, { props: { countries: [japan] } })
    const cells = w.findAll('tbody td').map(td => td.text())
    expect(cells).toEqual(['Japan', 'Japanese yen', 'Asia', '125836021', 'Open'])
  })
})
