import React from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload } from "react-icons/lu";

const ExpenseList = ({ transactions, onDelete, onDownload, hideHeader }) => {
  return (
    <div className={hideHeader ? "" : "card"}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg">All Expenses</h5>
          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-lg" /> Download
          </button>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end mb-3">
          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-lg" /> Download
          </button>
        </div>
      )}

      {transactions?.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No expenses found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;