import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Pagination from './index.vue'

const meta: Meta<typeof Pagination> = {
  title: 'Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 5, pageCount: 10 },
  render: args => ({
    components: { Pagination },
    setup: () => ({ args, page: ref(args.page) }),
    template: '<Pagination v-bind="args" v-model:page="page" />',
  }),
}

export default meta
type Story = StoryObj<typeof Pagination>

export const MiddlePage: Story = {}

export const FirstPage: Story = {
  args: { page: 1, pageCount: 10 },
}

export const LastPage: Story = {
  args: { page: 10, pageCount: 10 },
}

export const FewPages: Story = {
  args: { page: 2, pageCount: 3 },
}

export const SinglePage: Story = {
  args: { page: 1, pageCount: 1 },
  parameters: {
    docs: {
      description: {
        story: 'Renders nothing when there is only one page — this is expected: `pageCount > 1` gates the whole `<nav>`.',
      },
    },
  },
}
