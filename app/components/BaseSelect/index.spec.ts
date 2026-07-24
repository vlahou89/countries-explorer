import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from '~/testing/axe'
import BaseSelect from './index.vue'

describe('BaseSelect', () => {
  const options = [{ label: 'Europe', value: 'Europe' }, { label: 'Asia', value: 'Asia' }]

  it('has no accessibility violations', async () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region' } })
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('is a combobox button, closed by default', () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region' } })
    expect(w.find('[role="combobox"]').exists()).toBe(true)
    expect(w.find('[role="listbox"]').exists()).toBe(false)
  })

  it('shows the placeholder until a value is selected', () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region', placeholder: 'Include' } })
    expect(w.find('[role="combobox"]').text()).toBe('Include')
  })

  it('opens a listbox with every option on click', async () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region' } })
    await w.find('[role="combobox"]').trigger('click')
    const opts = w.findAll('[role="option"]')
    expect(opts).toHaveLength(2)
    expect(opts[0]!.text()).toBe('Europe')
  })

  it('emits the selected value and closes the listbox', async () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region' } })
    await w.find('[role="combobox"]').trigger('click')
    await w.findAll('[role="option"]')[1]!.trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual(['Asia'])
    expect(w.find('[role="listbox"]').exists()).toBe(false)
  })

  it('closes on Escape without changing the value', async () => {
    const w = mount(BaseSelect, { props: { modelValue: null, options, label: 'Region' } })
    await w.find('[role="combobox"]').trigger('click')
    await w.find('[role="combobox"]').trigger('keydown', { key: 'Escape' })
    expect(w.find('[role="listbox"]').exists()).toBe(false)
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})
