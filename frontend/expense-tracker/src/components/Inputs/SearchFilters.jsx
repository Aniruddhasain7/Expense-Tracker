import React, { useState } from "react";
import { LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";

const EXPENSE_CATEGORIES = [
  "All", "Food", "Rent", "Transport", "Groceries", "Entertainment",
  "Health", "Shopping", "Utilities", "Education", "Travel", "Other",
];

const SearchFilters = ({ type = "expense", onFilter, onReset }) => {
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

      <div className="flex items-center gap-2">

        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={filters.search}
            onChange={({ target }) => handleChange("search", target.value)}
            placeholder={type === "expense" ? "Search expenses…" : "Search income…"}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <LuX size={14} />
            </button>
          )}
        </div>


        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
            hasActiveFilters
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          }`}
        >
          <LuSlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-white text-green-600 text-[10px] font-bold flex items-center justify-center">
              ✓
            </span>
          )}
        </button>
      </div>


      {open && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-lg animate-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {type === "expense" && (
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange("category", cat)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        filters.category === cat
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-green-50 hover:border-green-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}


            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">From Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={({ target }) => handleChange("startDate", target.value)}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">To Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={({ target }) => handleChange("endDate", target.value)}
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>


            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Min Amount (₹)</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={({ target }) => handleChange("minAmount", target.value)}
                placeholder="0"
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Max Amount (₹)</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={({ target }) => handleChange("maxAmount", target.value)}
                placeholder="99999"
                className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>


          <div className="flex gap-3 mt-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="text-sm text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg cursor-pointer transition-colors"
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
