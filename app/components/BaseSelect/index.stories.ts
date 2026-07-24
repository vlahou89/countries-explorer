import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { within, userEvent } from 'storybook/test'
import BaseSelect from './index.vue'

const OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Currency', value: 'currency' },
  { label: 'Region', value: 'region' },
  { label: 'Language', value: 'language' },
]

const meta: Meta = {
  title: 'Base/BaseSelect',
  component: BaseSelect as Meta['component'],
  tags: ['autodocs'],
  args: {
    label: 'Key',
    placeholder: 'Include',
    options: OPTIONS,
    modelValue: null,
    disabled: false,
  },
  render: args => ({
    components: { BaseSelect },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: '<BaseSelect v-bind="args" v-model="value" />',
  }),
}

export default meta
type Story = StoryObj

export const Closed: Story = {}

export const WithSelection: Story = {
  args: { modelValue: 'region' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  },
}
