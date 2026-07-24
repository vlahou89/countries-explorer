import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from '~/testing/axe'
import BaseInput from './index.vue'

describe('BaseInput', () => {
  it('has no accessibility violations', async () => {
    const w = mount(BaseInput, { props: { modelValue: null, label: 'Value', placeholder: 'Value' } })
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('renders a text input with the given placeholder', () => {
    const w = mount(BaseInput, { props: { modelValue: null, label: 'Value', placeholder: 'Value' } })
    expect(w.find('input').attributes('placeholder')).toBe('Value')
  })

  it('shows the search icon only for the search variant', () => {
    const plain = mount(BaseInput, { props: { modelValue: null, label: 'Value' } })
    const search = mount(BaseInput, { props: { modelValue: null, label: 'Search', variant: 'search' } })
    expect(plain.find('svg').exists()).toBe(false)
    expect(search.find('svg').exists()).toBe(true)
  })

  it('emits the typed value', async () => {
    const w = mount(BaseInput, { props: { modelValue: null, label: 'Value' } })
    await w.find('input').setValue('Kenya')
    expect(w.emitted('update:modelValue')![0]).toEqual(['Kenya'])
  })

  it('emits null when cleared', async () => {
    const w = mount(BaseInput, { props: { modelValue: 'Kenya', label: 'Value' } })
    await w.find('input').setValue('')
    expect(w.emitted('update:modelValue')![0]).toEqual([null])
  })
})
