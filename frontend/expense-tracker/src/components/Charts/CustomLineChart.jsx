import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const CustomLineChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <p className="text-xs font-semibold text-green-700 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="font-medium text-gray-900">
              ₹{payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data.length) {
    return (
      <div className="h-75 flex items-center justify-center text-sm text-gray-400">
        No expense data available
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#22c55e"
            fill="url(#expenseGradient)"
            strokeWidth={3}
            dot={{ r: 6, fill: "#16a34a" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
