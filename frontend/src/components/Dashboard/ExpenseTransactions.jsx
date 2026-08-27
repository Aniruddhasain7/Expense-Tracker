import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Expenses
        </h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-sm" />
        </button>
      </div>

      <div className="mt-4">
        {(!transactions || transactions.length === 0) ? (
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 py-6 text-center">
            No expenses recorded yet.
          </p>
        ) : (
          transactions.slice(0, 5).map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;