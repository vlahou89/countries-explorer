import vueA11y from 'eslint-plugin-vuejs-accessibility'
import tsParser from '@typescript-eslint/parser'

export default [
  ...vueA11y.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tsParser },
    },
  },
  {
    files: ['app/components/BaseSelect/index.vue'],
    rules: {
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/interactive-supports-focus': 'off',
    },
  },
]
