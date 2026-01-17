import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";

export const mockDashboardData = {
  totalBalance: 5300,
  totalIncome: 5600,
  totalExpense: 300,

  // 🔹 Recent Transactions (already working)
  recentTransactions: [
    {
      id: 1,
      type: "expense",
      category: "Food",
      icon: LuUtensils,
      amount: 300,
      date: new Date("2026-01-15"),
    },
    {
      id: 2,
      type: "income",
      source: "Salary",
      icon: LuTrendingUp,
      amount: 5600,
      date: new Date("2026-01-15"),
    },
    {
      id: 3,
      type: "expense",
      category: "Shopping",
      icon: LuTrendingDown,
      amount: 200,
      date: new Date("2026-01-14"),
    },
  ],

  // 🔹 ADD THIS FOR LAST 30 DAYS CHART
  Last30DaysExpenses: [
    {
      category: "Food",
      amount: 120,
      date: new Date("2026-01-01"),
    },
    {
      category: "Shopping",
      amount: 220,
      date: new Date("2026-01-05"),
    },
    {
      category: "Travel",
      amount: 150,
      date: new Date("2026-01-10"),
    },
    {
      category: "Bills",
      amount: 180,
      date: new Date("2026-01-15"),
    },
    {
      category: "Food",
      amount: 90,
      date: new Date("2026-01-18"),
    },
  ],
};
