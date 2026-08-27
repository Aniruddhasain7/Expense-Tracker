import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";
import { useCurrency } from "../../context/CurrencyContext";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const { formatAmount } = useCurrency();

  const getAmountStyles = () =>
    type === "income"
      ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-[#0c1f13] dark:text-green-400 dark:border-[#1b3d26]"
      : "bg-rose-50 text-rose-600 border border-rose-200/60 dark:bg-[#200c0f] dark:text-rose-400 dark:border-[#3d1b20]";

  return (
    <div className="group relative flex items-center gap-3.5 mt-1.5 p-3 rounded-xl hover:bg-slate-100/70 dark:hover:bg-[#141414] transition-colors">
      <div className="w-11 h-11 flex items-center justify-center text-lg text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-[#181818] rounded-xl shrink-0 border border-slate-200/50 dark:border-[#282828] overflow-hidden">
        {icon ? (
          typeof icon === "string" ? (
            icon.startsWith("http") ? (
              <img
                src={icon}
                alt="icon"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{icon}</span>
            )
          ) : (
            React.createElement(icon)
          )
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <div className="min-w-0 pr-2">
          <p className="text-sm text-slate-800 dark:text-white font-medium truncate">
            {title}
          </p>
          <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5 truncate">
            {date}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hideDeleteBtn && (
            <button
              className="text-slate-400 hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1"
              onClick={onDelete}
              title="Delete transaction"
              aria-label="Delete"
            >
              <LuTrash2 size={16} />
            </button>
          )}

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${getAmountStyles()}`}
          >
            <span>
              {type === "income" ? "+" : "-"} {formatAmount(amount)}
            </span>
            {type === "income" ? (
              <LuTrendingUp size={14} />
            ) : (
              <LuTrendingDown size={14} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
