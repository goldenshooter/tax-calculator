import { describe, expect, it } from 'vitest'
import { calculateProgressiveTax, convertToYearlySalary, currencyFormatter, PERIODS } from './utils'
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

describe('convertToYearlySalary', () => {
  it('converts hourly pay to yearly pay', () => {
    expect(convertToYearlySalary(50, PERIODS.HOURLY)).toBe(104000)
  })

  it('converts weekly pay to yearly pay', () => {
    expect(convertToYearlySalary(2000, PERIODS.WEEKLY)).toBe(104000)
  })

  it('converts monthly pay to yearly pay', () => {
    expect(convertToYearlySalary(5000, PERIODS.MONTHLY)).toBe(60000)
  })

  it('returns yearly pay unchanged for yearly period', () => {
    expect(convertToYearlySalary(80000, PERIODS.YEARLY)).toBe(80000)
  })
})

describe('currencyFormatter', () => {
  it('formats positive numbers as USD currency with no decimal places', () => {
    expect(currencyFormatter.format(80000)).toBe('$80,000')
  })

  it('formats zero as USD currency', () => {
    expect(currencyFormatter.format(0)).toBe('$0')
  })
})