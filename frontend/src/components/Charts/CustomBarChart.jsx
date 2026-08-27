import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useCurrency } from '../../context/CurrencyContext';

const CustomBarChart = ({data = [], dataKey = "month"}) => {
    const { formatAmount } = useCurrency();

    const getBarColor = (index) => {
        return index % 2 === 0 ? "#22c55e" : "#bbf7d0"
    }

    const CustomTooltip = ({active, payload}) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white dark:bg-[#111111] shadow-xl rounded-xl p-3 border border-gray-200 dark:border-[#262626]'>
                    <p className='text-xs font-semibold text-green-600 dark:text-green-400 mb-1'>
                        {payload[0].payload.category || payload[0].payload.source || payload[0].payload.month}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                        Amount: <span className='text-sm font-bold text-gray-900 dark:text-white'>{formatAmount(payload[0].payload.amount)}</span>
                    </p>
                </div>
            )
        }
        return null;
    }

  return (
    <div className='bg-white dark:bg-transparent mt-6'>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokes="none" />
                <XAxis dataKey={dataKey} tick={{ fontSize: 12, fill: "#888"}} strokes="none"/>
                <YAxis tick={{ fontSize: 12, fill: "#888"}} stroke="none" />
                <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(255, 255, 255, 0.04)" }} />
                <Bar
                dataKey="amount"
                fill="#FF8042"
                radius={[10, 10, 0, 0]}
                activeDot={{ r: 8, fill:"yellow"}}
                activeStyle={{fill: "green"}}
                >
                    {data.map((entry, index)=>(
                     <Cell key={index} fill={getBarColor(index)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart;