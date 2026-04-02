import { useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import { fetchTaxBands, type TaxBand } from './api/mockTaxApi'
import { calculateProgressiveTax } from './utils'
import './App.css'

const PERIODS = {
  HOURLY: 'Hourly',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
} as const

const items = [
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

type Period = (typeof items)[number]['value']

function App() {
  const [salary, setSalary] = useState<string>('')
  const [taxToPay, setTaxToPay] = useState<number>(0)
  const [taxBands, setTaxBands] = useState<TaxBand[]>([])
  const [isLoadingBands, setIsLoadingBands] = useState<boolean>(true)
  const [period, setPeriod] = useState<Period>(PERIODS.YEARLY) // default to yearly.

  // could try React 19 useTransition.
  // load tax bands on mount.
  useEffect(() => {
    const loadBands = async () => {
      try {
        const bands = await fetchTaxBands()
        setTaxBands(bands)
      } finally {
        setIsLoadingBands(false)
      }
    }

    void loadBands()
  }, [])

  // calculate tax whenever salary, taxBands or period changes.
  useEffect(() => {
    const salaryNum = parseFloat(salary)
    if (isNaN(salaryNum) || salaryNum < 0 || taxBands.length === 0) {
      setTaxToPay(0)
      return
    }

    let yearlySalary = 0
    // convert salary to yearly based on selected option, for simplicity we assume 40 working hours per week and 52 weeks per year.
    switch (period) {
      case PERIODS.HOURLY: // Hourly
        yearlySalary = salaryNum * 40 * 52
        break
      case PERIODS.WEEKLY: // Weekly
        yearlySalary = salaryNum * 52
        break
      case PERIODS.MONTHLY: // Monthly
        yearlySalary = salaryNum * 12
        break
      default:
        yearlySalary = salaryNum
        break
    }
    const tax = calculateProgressiveTax(yearlySalary, taxBands)
    setTaxToPay(tax)
  }, [salary, taxBands, period])

  return (
    <div className="page-container">
      <h1>Salary Calculator</h1>
      <Input
        placeholder="Enter your salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        style={{ width: 200 }}
      />
      <Select
        value={period}
        onChange={(value) => setPeriod(value)}
        options={[...items]}
        style={{ width: 200, marginTop: 20 }}
      />
      <p>{isLoadingBands ? 'Loading tax bands...' : `Tax to pay: ${taxToPay.toFixed(2)}`}</p>
    </div>
  )
}

export default App
