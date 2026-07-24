import { expect } from 'vitest'
import { toHaveNoViolations } from 'vitest-axe/dist/matchers.js'

declare module '@vitest/expect' {
  interface Matchers<T = any> {
    toHaveNoViolations: () => T
  }
}

expect.extend({ toHaveNoViolations })
