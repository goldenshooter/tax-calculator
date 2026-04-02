import { useEffect, useState } from 'react'
import { Button, Card, Drawer, Flex, Input, Select, Statistic, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { fetchTaxBands, type TaxBand } from './api/mockTaxApi'
import {
  calculateProgressiveTax,
  convertToYearlySalary,
  currencyFormatter,
  ITEMS,
  PERIODS,
  type Period,
} from './utils'
import './App.css'

const { Title, Text } = Typography

type TaxBandRow = {
  key: string
  band: string
  incomeRange: string
  taxRate: string
}

const tableColumns: TableColumnsType<TaxBandRow> = [
  {
    title: 'Band',
    dataIndex: 'band',
    key: 'band',
    width: 90,
  },
  {
    title: 'Income Range',
    dataIndex: 'incomeRange',
    key: 'incomeRange',
  },
  {
    title: 'Tax Rate',
    dataIndex: 'taxRate',
    key: 'taxRate',
    width: 110,
  },
]

function App() {
  const [salary, setSalary] = useState<string>('')
  const [taxToPay, setTaxToPay] = useState<number>(0)
  const [taxBands, setTaxBands] = useState<TaxBand[]>([])
  const [isLoadingBands, setIsLoadingBands] = useState<boolean>(true)
  const [period, setPeriod] = useState<Period>(PERIODS.YEARLY)
  const [drawerOpen, setDrawerOpen] = useState(false)

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

    const yearlySalary = convertToYearlySalary(salaryNum, period)
    const tax = calculateProgressiveTax(yearlySalary, taxBands)
    setTaxToPay(tax)
  }, [salary, taxBands, period])

  const salaryNum = parseFloat(salary)
  const grossPay = !isNaN(salaryNum) && salaryNum > 0 ? convertToYearlySalary(salaryNum, period) : 0
  const tax = isLoadingBands ? 0 : taxToPay
  const takeHomePay = Math.max(grossPay - tax, 0)

  const taxBandRows: TaxBandRow[] = taxBands.map((band, index) => ({
    key: `${band.bandStart}-${band.bandEnd ?? 'max'}`,
    band: `Band ${index + 1}`,
    incomeRange:
      band.bandEnd === null
        ? `${currencyFormatter.format(band.bandStart)} and above`
        : `${currencyFormatter.format(band.bandStart)} - ${currencyFormatter.format(band.bandEnd)}`,
    taxRate: `${(band.taxRate * 100).toFixed(1)}%`,
  }))

  return (
    <div className="calculator-container">
      <Flex vertical gap={16}>
        <Card variant="borderless" className="main-card">
          <Flex vertical gap={20} style={{ width: '100%' }}>
            <div className="header-block">
              <Title level={3} className="main-title">
                Salary Tax Calculator
              </Title>
              <Text type="secondary" className="subtitle">
                Estimate your annual tax instantly with current tax bands.
              </Text>
            </div>

            <Flex className="input-row" gap={16}>
              <div className="field-group">
                <Text>Salary Amount</Text>
                <Input
                  prefix="$"
                  placeholder="e.g. 80,000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  size="large"
                />
              </div>

              <div className="field-group">
                <Text className="field-label">Period</Text>
                <Select
                  value={period}
                  onChange={(value) => setPeriod(value)}
                  options={[...ITEMS]}
                  size="large"
                  style={{ width: '100%' }}
                />
              </div>
            </Flex>

            <Card size="small" className="result-card">
              <Flex vertical gap={16}>
                <Statistic
                  title="Tax"
                  value={tax}
                  precision={2}
                  prefix="$"
                  loading={isLoadingBands}
                  valueStyle={{ fontSize: 42, fontWeight: 700 }}
                />

                <Flex gap={12} wrap="wrap">
                  <div className="stat-box">
                    <Statistic
                      title="Gross Pay"
                      value={grossPay}
                      precision={2}
                      prefix="$"
                      loading={isLoadingBands}
                    />
                  </div>
                  <div className="stat-box">
                    <Statistic
                      title="Take Home Pay"
                      value={takeHomePay}
                      precision={2}
                      prefix="$"
                      loading={isLoadingBands}
                    />
                  </div>
                </Flex>

                <Typography.Text type="secondary">
                  Estimate only. Final tax may vary based on deductions and personal circumstances.
                </Typography.Text>

                <Button type="link" size="small" onClick={() => setDrawerOpen(true)}>
                  Show Tax Band Breakdown
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Card>

        <Drawer
          title="Tax band breakdown"
          closable={{ 'aria-label': 'Close Button' }}
          size="600px"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Card variant="borderless">
            <Table<TaxBandRow>
              rowKey="key"
              columns={tableColumns}
              dataSource={taxBandRows}
              loading={isLoadingBands}
              pagination={false}
              scroll={{ x: 400 }}
            />
          </Card>
        </Drawer>
      </Flex>
    </div>
  )
}

export default App
