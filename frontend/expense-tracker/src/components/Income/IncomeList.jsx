import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const IncomeList = ({ transactions, onDelete, onDownload, hideHeader }) => {
  return (
    <div className={hideHeader ? "" : "card"}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg">Income Sources</h5>
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
        <p className="text-sm text-gray-400 text-center py-6">No income found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
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