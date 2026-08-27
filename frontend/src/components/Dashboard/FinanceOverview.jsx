import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { useCurrency } from "../../context/CurrencyContext";

const COLORS = ["#22C55E", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const { formatAmount } = useCurrency();

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Financial Overview
        </h5>
      </div>
      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={formatAmount(totalBalance || 0)}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
