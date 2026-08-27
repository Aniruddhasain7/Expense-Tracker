import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Income Overview
          </h5>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Track your earnings over time and analyze your income trends
          </p>
        </div>
        <button className="add-btn self-start sm:self-auto" onClick={onAddIncome}>
          <LuPlus className="text-base" />
          Add Income
        </button>
      </div>
      <div className="mt-6">
        <CustomBarChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;