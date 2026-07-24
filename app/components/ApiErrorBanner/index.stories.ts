import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ApiErrorBanner from './index.vue'
import { ApiError } from '~/services/api'

const meta: Meta<typeof ApiErrorBanner> = {
  title: 'ApiErrorBanner',
  component: ApiErrorBanner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ApiErrorBanner>

export const Network: Story = {
  args: { error: new ApiError('network', "Couldn't reach the countries service. Check your connection.") },
}

export const Timeout: Story = {
  args: { error: new ApiError('timeout', 'That took too long. Try again.') },
}

export const NotFound: Story = {
  args: { error: new ApiError('not-found', "We couldn't find that country.", 404) },
}

export const ServerError: Story = {
  args: { error: new ApiError('server', 'The countries service is having problems.', 500) },
}
