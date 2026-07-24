import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseButton from './index.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Base/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
  },
  args: {
    variant: 'secondary',
    disabled: false,
  },
  render: args => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: '<BaseButton v-bind="args">Add</BaseButton>',
  }),
}

export default meta
type Story = StoryObj<typeof BaseButton>

export const Secondary: Story = {}

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
  render: args => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: '<BaseButton v-bind="args">Open</BaseButton>',
  }),
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
}

export const WithIcon: Story = {
  args: { variant: 'primary' },
  render: args => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: `
      <BaseButton v-bind="args">
        <template #icon>
          <svg class="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke-linecap="round" />
          </svg>
        </template>
        Add
      </BaseButton>
    `,
  }),
}
