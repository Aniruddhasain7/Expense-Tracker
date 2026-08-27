import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { useCurrency } from "../../context/CurrencyContext";

const COLORS = ["#22C55E", "#FF6900", "#FA2C37", "#3B82F6"];

const RecentIncomeWithChart = ({ data = [] }) => {
  const { formatAmount } = useCurrency();
  const [chartData, setChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!data.length) return;

    const formattedData = data.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    const total = data.reduce((sum, item) => sum + (item?.amount || 0), 0);

    setChartData(formattedData);
    setTotalIncome(total);
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Last 60 Days Income
        </h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={formatAmount(totalIncome || 0)}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
