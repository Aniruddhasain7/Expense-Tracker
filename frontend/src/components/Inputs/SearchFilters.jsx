import React, { useState } from "react";
import { LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { useCurrency } from "../../context/CurrencyContext";

const EXPENSE_CATEGORIES = [
  "All", "Food", "Rent", "Transport", "Groceries", "Entertainment",
  "Health", "Shopping", "Utilities", "Education", "Travel", "Other",
];

const SearchFilters = ({ type = "expense", onFilter, onReset }) => {
  const { currency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category !== "All") ||
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount;

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    if (key === "search") emitFilter(updated);
  };

  const emitFilter = (f = filters) => {
    const params = {};
    if (f.search) params.search = f.search;
    if (f.category && f.category !== "All") params.category = f.category;
    if (f.startDate) params.startDate = f.startDate;
    if (f.endDate) params.endDate = f.endDate;
    if (f.minAmount) params.minAmount = f.minAmount;
    if (f.maxAmount) params.maxAmount = f.maxAmount;
    onFilter(params);
  };

  const handleApply = () => {
    emitFilter();
    setOpen(false);
  };

  const handleReset = () => {
    const cleared = {
      search: "",
      category: "All",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    };
    setFilters(cleared);
    onReset();
    setOpen(false);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm" />
          <input
            type="text"
            value={filters.search}
            onChange={({ target }) => handleChange("search", target.value)}
            placeholder={type === "expense" ? "Search expenses…" : "Search income…"}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 border border-slate-200 dark:border-[#262626] rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <LuX size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
            hasActiveFilters
              ? "bg-green-500 text-white border-green-500 shadow-sm"
              : "bg-slate-50 dark:bg-[#141414] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#282828] hover:bg-slate-100 dark:hover:bg-[#1c1c1c]"
          }`}
        >
          <LuSlidersHorizontal size={15} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-4.5 h-4.5 rounded-full bg-white text-green-600 text-[10px] font-bold flex items-center justify-center">
              ✓
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="mt-3 p-4 sm:p-5 bg-white dark:bg-[#101010] border border-slate-200/90 dark:border-[#242424] rounded-2xl shadow-xl animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {type === "expense" && (
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500 dark:text-gray-400 font-semibold mb-2 block uppercase tracking-wider">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange("category", cat)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        filters.category === cat
                          ? "bg-green-500 text-white border-green-500 shadow-sm"
                          : "bg-slate-50 dark:bg-[#181818] text-slate-600 dark:text-gray-300 border-slate-200 dark:border-[#2a2a2a] hover:bg-green-50 dark:hover:bg-[#222222]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1.5 block">
                From Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={({ target }) => handleChange("startDate", target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1.5 block">
                To Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={({ target }) => handleChange("endDate", target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1.5 block">
                Min Amount ({currency.symbol})
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={({ target }) => handleChange("minAmount", target.value)}
                placeholder="0"
                className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1.5 block">
                Max Amount ({currency.symbol})
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={({ target }) => handleChange("maxAmount", target.value)}
                placeholder="99999"
                className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-[#161616] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a2a2a] rounded-xl outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-[#2a2a2a] hover:bg-slate-50 dark:hover:bg-[#1c1c1c] cursor-pointer transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-medium cursor-pointer transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
