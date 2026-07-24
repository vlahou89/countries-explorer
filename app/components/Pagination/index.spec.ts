import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from '~/testing/axe'
import Pagination from './index.vue'

function pageLabels(w: ReturnType<typeof mount>) {
  return w.findAll('button[aria-label^="Go to page"]').map(b => b.text())
}

describe('Pagination', () => {
  it('has no accessibility violations', async () => {
    const w = mount(Pagination, { props: { page: 5, pageCount: 10 } })
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('renders nothing for a single page', () => {
    const w = mount(Pagination, { props: { page: 1, pageCount: 1 } })
    expect(w.find('nav').exists()).toBe(false)
  })

  it('shows first, current-1, current, current+1, last on a middle page', () => {
    const w = mount(Pagination, { props: { page: 5, pageCount: 10 } })
    expect(pageLabels(w)).toEqual(['1', '4', '5', '6', '10'])
  })

  it('extends forward on the first page instead of showing a lone number', () => {
    const w = mount(Pagination, { props: { page: 1, pageCount: 10 } })
    expect(pageLabels(w)).toEqual(['1', '2', '3', '4', '10'])
  })

  it('extends backward on the last page', () => {
    const w = mount(Pagination, { props: { page: 10, pageCount: 10 } })
    expect(pageLabels(w)).toEqual(['1', '7', '8', '9', '10'])
  })

  it('never renders an ellipsis', () => {
    const w = mount(Pagination, { props: { page: 5, pageCount: 10 } })
    expect(w.text()).not.toContain('…')
  })

  it('marks the current page with aria-current', () => {
    const w = mount(Pagination, { props: { page: 5, pageCount: 10 } })
    expect(w.find('[aria-current="page"]').text()).toBe('5')
  })

  it('disables first/previous on page 1 and last/next on the final page', () => {
    const first = mount(Pagination, { props: { page: 1, pageCount: 10 } })
    expect(first.find('[aria-label="First page"]').attributes('disabled')).toBeDefined()
    expect(first.find('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()

    const last = mount(Pagination, { props: { page: 10, pageCount: 10 } })
    expect(last.find('[aria-label="Next page"]').attributes('disabled')).toBeDefined()
    expect(last.find('[aria-label="Last page"]').attributes('disabled')).toBeDefined()
  })

  it('emits update:page when a page number or arrow button is clicked', async () => {
    const w = mount(Pagination, { props: { page: 5, pageCount: 10 } })
    await w.find('[aria-label="Go to page 6"]').trigger('click')
    expect(w.emitted('update:page')![0]).toEqual([6])
  })
})
