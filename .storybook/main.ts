import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    config.plugins ??= []
    config.plugins.push(vue(), svgLoader())
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': fileURLToPath(new URL('../app', import.meta.url)),
    }
    return config
  },
}

export default config
