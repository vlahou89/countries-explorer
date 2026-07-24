import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CountryMap from './index.vue'

const meta: Meta<typeof CountryMap> = {
  title: 'CountryMap',
  component: CountryMap,
  tags: ['autodocs'],
  args: { lat: 35.6762, lng: 139.6503, label: 'Japan' },
}

export default meta
type Story = StoryObj<typeof CountryMap>

export const Default: Story = {}

export const AnotherLocation: Story = {
  args: { lat: -14.235, lng: -51.9253, label: 'Brazil' },
}
