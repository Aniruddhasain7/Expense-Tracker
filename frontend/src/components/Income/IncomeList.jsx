import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions, onDelete, onDownload, hideHeader }) => {
  return (
    <div className={hideHeader ? "" : "card"}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Income Sources
          </h5>
          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-base" /> Download
          </button>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end mb-3">
          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-base" /> Download Excel
          </button>
        </div>
      )}

      {(!transactions || transactions.length === 0) && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          No income records found.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;