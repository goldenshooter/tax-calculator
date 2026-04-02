import { type TaxBand } from './api/mockTaxApi'

export const PERIODS = {
  HOURLY: 'Hourly',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
} as const

export const items = [
  {
    value: PERIODS.HOURLY,
    label: PERIODS.HOURLY,
  },
  {
    value: PERIODS.WEEKLY,
    label: PERIODS.WEEKLY,
  },
  {
    value: PERIODS.MONTHLY,
    label: PERIODS.MONTHLY,
  },
  {
    value: PERIODS.YEARLY,
    label: PERIODS.YEARLY,
  },
] as const

export type Period = (typeof items)[number]['value']

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

 export const convertToYearlySalary = (salaryNum: number, selectedPeriod: Period) => {
    switch (selectedPeriod) {
      case PERIODS.HOURLY:
        return salaryNum * 40 * 52
      case PERIODS.WEEKLY:
        return salaryNum * 52
      case PERIODS.MONTHLY:
        return salaryNum * 12
      default:
        return salaryNum
    }
  }
