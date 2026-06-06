import React from "react";
import moment from "moment";
import { LuTrash2, LuPause, LuPlay, LuRepeat } from "react-icons/lu";

const FREQ_COLORS = {
  daily: "bg-orange-50 text-orange-600 border-orange-200",
  weekly: "bg-blue-50 text-blue-600 border-blue-200",
  monthly: "bg-green-50 text-green-600 border-green-200",
  yearly: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const RecurringList = ({ items, onDelete, onToggle }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <LuRepeat className="text-2xl text-green-400" />
        </div>
        <p className="text-gray-500 text-sm">No recurring transactions yet.</p>
        <p className="text-gray-400 text-xs mt-1">
          Add salary, rent, subscriptions, EMI and more.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      {items.map((item) => (
        <div
          key={item._id}
          className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all ${
            item.isActive
              ? "bg-white border-gray-200 shadow-sm"
              : "bg-gray-50 border-gray-100 opacity-60"
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center text-xl bg-gray-100 rounded-full shrink-0 overflow-hidden border border-gray-100">
            {item.icon ? (
              (typeof item.icon === "string" && (item.icon.startsWith("http") || item.icon.includes("cdn.jsdelivr.net") || item.icon.includes("://"))) ? (
                <img
                  src={item.icon}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="truncate max-w-full px-1">{item.icon}</span>
              )
            ) : (
              <span>{item.type === "income" ? "💰" : "💳"}</span>
            )}
          </div>


          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {item.title}
              </p>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${FREQ_COLORS[item.frequency] || FREQ_COLORS.monthly}`}
              >
                {item.frequency}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${
                  item.type === "income"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {item.type}
              </span>
            </div>

            <p className="text-base font-bold mt-1 text-gray-900">
              {item.type === "income" ? "+" : "-"}₹
              {item.amount?.toLocaleString("en-IN")}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Next due:{" "}
              <span className="text-gray-600 font-medium">
                {moment(item.nextDueDate).format("Do MMM YYYY")}
              </span>
            </p>
          </div>


          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => onToggle(item._id, !item.isActive)}
              title={item.isActive ? "Pause" : "Resume"}
              className="text-gray-400 hover:text-green-500 transition-colors cursor-pointer"
            >
              {item.isActive ? <LuPause size={16} /> : <LuPlay size={16} />}
            </button>
            <button
              onClick={() => onDelete(item._id)}
              title="Delete"
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LuTrash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecurringList;
