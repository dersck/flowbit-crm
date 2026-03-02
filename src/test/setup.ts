import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

class ResizeObserverMock {
  observe() { }
  unobserve() { }
  disconnect() { }
}

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() { },
      removeListener() { },
      addEventListener() { },
      removeEventListener() { },
      dispatchEvent() {
        return false
      },
    }),
  })
}

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => { }
}
