import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Navbar from '@/components/Navbar'

test('Navbar renders correctly', () => {
  render(<Navbar />)
  expect(screen.getByText(/NewDay/i)).toBeInTheDocument()
  expect(screen.getByText(/Ventures/i)).toBeInTheDocument()
})
