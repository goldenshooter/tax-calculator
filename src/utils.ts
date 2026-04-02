import { type TaxBand } from './api/mockTaxApi'

export const calculateProgressiveTax = (income: number, bands: TaxBand[]) => {
  let totalTax = 0

  for (const band of bands) {
    if (income <= band.bandStart) {
      continue
    }

    const taxableUpper = band.bandEnd ?? income
    const taxableAmount = Math.min(income, taxableUpper) - band.bandStart

    if (taxableAmount > 0) {
      totalTax += taxableAmount * band.taxRate
    }
  }

  return totalTax
}
