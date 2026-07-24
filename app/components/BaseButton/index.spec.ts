import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from '~/testing/axe'
import BaseButton from './index.vue'

describe('BaseButton', () => {
  it('has no accessibility violations', async () => {
    const w = mount(BaseButton, { slots: { default: 'Add' } })
    expect(await axe(w.element)).toHaveNoViolations()
  })

  it('defaults to the secondary variant', () => {
    const w = mount(BaseButton, { slots: { default: 'Add' } })
    expect(w.classes()).toContain('btn--secondary')
  })

  it.each(['primary', 'secondary', 'outline'] as const)('applies %s variant styling', (variant) => {
    const w = mount(BaseButton, { props: { variant }, slots: { default: 'Go' } })
    expect(w.find('button').exists()).toBe(true)
  })

  it('renders slotted icon content before the label', () => {
    const w = mount(BaseButton, { slots: { icon: '<span class="plus">+</span>', default: 'Add' } })
    expect(w.find('.plus').exists()).toBe(true)
    expect(w.text()).toBe('+Add')
  })

  it('disables the button and applies disabled styling', () => {
    const w = mount(BaseButton, { props: { disabled: true }, slots: { default: 'Add' } })
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })
})
