import { describe, expect, it } from 'vitest'
import { calculateProgressiveTax } from './utils'
import taxBands from './income-tax-bands.json'

describe('calculateProgressiveTax', () => {
  it('calculates tax for income within the first band', () => {
    expect(calculateProgressiveTax(5000, taxBands)).toBe(575)
  })

  it('calculates tax for income spanning multiple bands', () => {
    expect(calculateProgressiveTax(15000, taxBands)).toBe(1820)
    expect(calculateProgressiveTax(50000, taxBands)).toBe(9380)
  })

  it('calculates tax for income above all bands', () => {
    expect(calculateProgressiveTax(80000, taxBands)).toBe(19230)
  })

  it('returns 0 for non-positive income', () => {
    expect(calculateProgressiveTax(0, taxBands)).toBe(0)
    expect(calculateProgressiveTax(-5000, taxBands)).toBe(0)
  })
})