import { expect, test, describe } from 'vitest'
import { cn, formatPrice } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn()', () => {
    test('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
      expect(cn('bg-red-500', { 'text-white': true, 'hidden': false })).toBe('bg-red-500 text-white')
    })
    
    test('handles conflicting tailwind classes', () => {
      // Assuming tailwind-merge resolves p-4 and p-2 to p-2
      expect(cn('p-4', 'p-2')).toBe('p-2')
    })
  })

  describe('formatPrice()', () => {
    test('formats numbers as INR currency', () => {
      const result = formatPrice(1500)
      // Different environments might use different spaces (e.g., non-breaking space)
      // so we just check for the components
      expect(result).toContain('₹')
      expect(result).toContain('1,500.00')
    })
    
    test('handles zero correctly', () => {
      const result = formatPrice(0)
      expect(result).toContain('₹')
      expect(result).toContain('0.00')
    })
  })
})
