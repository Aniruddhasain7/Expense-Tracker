import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useCurrency } from "../../context/CurrencyContext";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuSparkles,
  LuFlame,
  LuCalendar,
  LuSlidersHorizontal,
  LuLightbulb,
  LuTarget,
} from "react-icons/lu";

const PIE_COLORS = ["#22C55E", "#FF6900", "#FA2C37", "#3B82F6", "#A855F7", "#EC4899", "#14B8A6", "#EAB308"];

const Analytics = () => {
  useUserAuth();
  const { formatAmount } = useCurrency();

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [expRes, incRes, dashRes] = await Promise.allSettled([
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
          axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
          axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
        ]);

        if (expRes.status === "fulfilled" && expRes.value?.data) {
          setExpenses(expRes.value.data);
        }
        if (incRes.status === "fulfilled" && incRes.value?.data) {
          setIncomes(incRes.value.data);
        }
        if (dashRes.status === "fulfilled" && dashRes.value?.data) {
          setDashboardData(dashRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Compute analytics
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Current month expenses
  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // Previous month expenses
  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();
  const prevMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });

  const currentMonthTotal = currentMonthExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const prevMonthTotal = prevMonthExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // Month-over-month change %
  const momChange =
    prevMonthTotal > 0
      ? Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100)
      : null;

  // Daily burn rate and projected end-of-month expense
  const dailyBurnRate = currentDay > 0 ? Math.round(currentMonthTotal / currentDay) : 0;
  const projectedTotal = Math.round(dailyBurnRate * daysInMonth);

  // Top category
  const categoryTotals = {};
  currentMonthExpenses.forEach((e) => {
    const cat = e.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount || 0);
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;
  const topCategoryPercentage =
    topCategory && currentMonthTotal > 0
      ? Math.round((topCategory[1] / currentMonthTotal) * 100)
      : 0;

  // Largest single expense
  const largestExpense = currentMonthExpenses.reduce(
    (max, e) => (Number(e.amount) > (max ? Number(max.amount) : 0) ? e : max),
    null
  );

  // Weekend vs Weekday spending
  let weekdayTotal = 0;
  let weekendTotal = 0;
  currentMonthExpenses.forEach((e) => {
    const day = new Date(e.date).getDay();
    const amt = Number(e.amount || 0);
    if (day === 0 || day === 6) {
      weekendTotal += amt;
    } else {
      weekdayTotal += amt;
    }
  });

  const weekendPercentage =
    currentMonthTotal > 0 ? Math.round((weekendTotal / currentMonthTotal) * 100) : 0;

  // Pie chart data for category breakdown
  const pieCategoryData = sortedCategories.map(([name, amount]) => ({
    name,
    amount,
  }));

  return (
    <DashboardLayout activeMenu="Analytics">
      <div className="my-5 mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LuSparkles className="text-green-500" /> Smart Financial Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              Deep insights, spending habits, velocity projections, and trends.
            </p>
          </div>
        </div>

        {/* 4 Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MoM Expense Trend */}
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              MoM Spending Trend
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {momChange !== null ? `${Math.abs(momChange)}%` : "N/A"}
              </span>
              {momChange !== null && (
                <span
                  className={`flex items-center text-xs font-bold ${
                    momChange > 0 ? "text-[#FA2C37]" : "text-[#22C55E]"
                  }`}
                >
                  {momChange > 0 ? (
                    <>
                      <LuTrendingUp size={14} /> Higher
                    </>
                  ) : (
                    <>
                      <LuTrendingDown size={14} /> Lower
                    </>
                  )}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1 truncate">
              vs {formatAmount(prevMonthTotal)} last month
            </p>
          </div>

          {/* Daily Burn Rate */}
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <LuFlame className="text-[#FF6900]" /> Daily Burn Rate
            </p>
            <p className="text-2xl font-bold text-[#FF6900] mt-2">
              {formatAmount(dailyBurnRate)}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              Projected end-of-month: {formatAmount(projectedTotal)}
            </p>
          </div>

          {/* Top Category */}
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <LuSlidersHorizontal className="text-[#3B82F6]" /> Top Expense Category
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 truncate">
              {topCategory ? topCategory[0] : "None"}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1">
              {topCategory ? `${formatAmount(topCategory[1])} (${topCategoryPercentage}% of total)` : "No expenses"}
            </p>
          </div>

          {/* Largest Single Expense */}
          <div className="card p-5">
            <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <LuTarget className="text-[#A855F7]" /> Largest Single Expense
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {largestExpense ? formatAmount(largestExpense.amount) : "₹0"}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-1 truncate">
              {largestExpense ? largestExpense.category : "None recorded"}
            </p>
          </div>
        </div>

        {/* 2-Column Analytics Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown Pie Chart */}
          <div className="card">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Spending Distribution This Month
            </h4>
            <p className="text-xs text-slate-400 dark:text-gray-400 mb-4">
              Breakdown of expenses by category for {now.toLocaleString("default", { month: "long" })}
            </p>

            {pieCategoryData.length > 0 ? (
              <CustomPieChart
                data={pieCategoryData}
                label="Total Spent"
                totalAmount={formatAmount(currentMonthTotal)}
                colors={PIE_COLORS}
                showTextAnchor
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-slate-400 dark:text-gray-500">
                No expense data recorded this month.
              </div>
            )}
          </div>

          {/* Smart AI Financial Tips & Patterns */}
          <div className="space-y-4">
            <div className="card space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LuLightbulb className="text-amber-400" /> Smart Financial Observations
              </h4>

              {/* Tip 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200/70 dark:border-[#222222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <span>⏱️ Daily Spending Pace</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  At your current rate of <span className="font-semibold">{formatAmount(dailyBurnRate)}/day</span>, your estimated spending for this month will be <span className="font-semibold text-slate-900 dark:text-white">{formatAmount(projectedTotal)}</span>.
                </p>
              </div>

              {/* Tip 2: Weekend vs Weekday */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200/70 dark:border-[#222222] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <span>🏖️ Weekend vs Weekday Spending</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-[#FF6900]">{weekendPercentage}%</span> of your monthly spending happens on weekends ({formatAmount(weekendTotal)}), while {100 - weekendPercentage}% happens on weekdays ({formatAmount(weekdayTotal)}).
                </p>
              </div>

              {/* Tip 3: Category concentration */}
              {topCategory && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200/70 dark:border-[#222222] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span>🎯 Category Concentration</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                    Your highest expense category is <span className="font-semibold text-[#22C55E]">{topCategory[0]}</span>, taking up {topCategoryPercentage}% ({formatAmount(topCategory[1])}) of your monthly budget.
                  </p>
                </div>
              )}
            </div>

            {/* Category Ranking List */}
            <div className="card p-5">
              <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Top Spending Categories
              </h5>
              <div className="space-y-2.5">
                {sortedCategories.slice(0, 5).map(([catName, amt], idx) => {
                  const pct = currentMonthTotal > 0 ? Math.round((amt / currentMonthTotal) * 100) : 0;
                  return (
                    <div key={catName} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 dark:text-gray-200">
                          {idx + 1}. {catName}
                        </span>
                        <span className="text-slate-500 dark:text-gray-400">
                          {formatAmount(amt)} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
