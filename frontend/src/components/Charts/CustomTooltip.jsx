import React from "react";
import { useCurrency } from "../../context/CurrencyContext";

const CustomTooltip = ({ active, payload }) => {
  const { formatAmount } = useCurrency();

  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#111111] shadow-xl rounded-xl p-3 border border-slate-200 dark:border-[#262626]">
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
          {payload[0].name}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300">
          Amount:{" "}
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {formatAmount(payload[0].value)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;