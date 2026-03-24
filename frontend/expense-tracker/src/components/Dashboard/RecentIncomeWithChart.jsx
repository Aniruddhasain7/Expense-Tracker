import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#875CF5", "#FA2C37", "#4f39f6"]

const RecentIncomeWithChart = ({ data = [] }) => {
  const [chartData, setChartData] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    if (!data.length) return

    const formattedData = data.map(item => ({
      name: item?.source,
      amount: item?.amount
    }))

    const total = data.reduce(
      (sum, item) => sum + (item?.amount || 0),
      0
    )

    setChartData(formattedData)
    setTotalIncome(total)
  }, [data])

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  )
}

export default RecentIncomeWithChart
