import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import BaseInput from './index.vue'

const meta: Meta<typeof BaseInput> = {
  title: 'Base/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'search'] },
    type: { control: 'select', options: ['text', 'number', 'email'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: {
    label: 'Value',
    placeholder: 'Value',
    modelValue: null,
    disabled: false,
    hideLabel: false,
    variant: 'default',
    type: 'text',
    size: 'md',
  },
  render: args => ({
    components: { BaseInput },
    setup: () => ({ args, value: ref(args.modelValue) }),
    template: '<BaseInput v-bind="args" v-model="value" />',
  }),
}

export default meta
type Story = StoryObj<typeof BaseInput>

export const Empty: Story = {}

export const WithValue: Story = {
  args: { modelValue: 'Kenya' },
}

export const Search: Story = {
  args: { variant: 'search', label: 'Search', placeholder: 'Search', hideLabel: true },
}

export const Disabled: Story = {
  args: { disabled: true, modelValue: 'Kenya' },
}

export const Small: Story = {
  args: { size: 'sm', label: 'Population, low', placeholder: 'Low', hideLabel: true },
}

export const HiddenLabel: Story = {
  args: { hideLabel: true },
}

export const NumberType: Story = {
  args: { type: 'number', label: 'Population', placeholder: '0' },
}
