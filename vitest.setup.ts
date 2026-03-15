import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next-auth
vi.mock('next-auth/react', () => {
  const originalModule = vi.importActual('next-auth/react');
  return {
    ...originalModule,
    useSession: vi.fn(() => {
      return { data: null, status: 'unauthenticated' };
    }),
    signOut: vi.fn(),
  };
});

// Mock CartContext
vi.mock('@/components/CartContext', () => ({
  useCart: vi.fn(() => ({
    items: [],
    setIsCartOpen: vi.fn(),
  })),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js router config
vi.mock('next/router', () => require('next-router-mock'))

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
