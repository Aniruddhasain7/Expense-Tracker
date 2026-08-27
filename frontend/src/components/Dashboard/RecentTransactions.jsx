import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Recent Transactions
        </h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-sm" />
        </button>
      </div>

      <div className="mt-4">
        {(!transactions || transactions.length === 0) ? (
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 py-6 text-center">
            No transactions recorded yet.
          </p>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.type === "expense" ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format("Do MMM YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;