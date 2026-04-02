import taxBandsJson from '../income-tax-bands.json'

export type TaxBand = {
  bandStart: number
  bandEnd: number | null
  taxRate: number
}

const MOCK_DELAY_MS = 500

export function fetchTaxBands(): Promise<TaxBand[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taxBandsJson as TaxBand[])
    }, MOCK_DELAY_MS)
  })
}
