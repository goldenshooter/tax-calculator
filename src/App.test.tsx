import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./api/mockTaxApi', () => ({
  fetchTaxBands: vi.fn().mockResolvedValue([
    { bandStart: 0, bandEnd: 14000, taxRate: 0.115 },
    { bandStart: 14000, bandEnd: 48000, taxRate: 0.21 },
    { bandStart: 48000, bandEnd: 70000, taxRate: 0.315 },
    { bandStart: 70000, bandEnd: null, taxRate: 0.355 },
  ]),
}))

describe('App', () => {
  it('calculates yearly tax after entering salary', async () => {
    render(<App />)

    const salaryInput = screen.getByRole('textbox', { name: /enter your salary/i })
    await userEvent.type(salaryInput, '80000')

    await waitFor(() => {
      expect(screen.getByText('Tax to pay: 19230.00')).toBeDefined()
    })
  })
})
