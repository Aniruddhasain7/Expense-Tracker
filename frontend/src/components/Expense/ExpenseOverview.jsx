import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Expense Overview
          </h5>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Track your spending trends over time and gain insights into where your money goes.
          </p>
        </div>
        <button className="add-btn self-start sm:self-auto" onClick={onExpenseIncome}>
          <LuPlus className="text-base" />
          Add Expense
        </button>
      </div>
      <div className="mt-6">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;