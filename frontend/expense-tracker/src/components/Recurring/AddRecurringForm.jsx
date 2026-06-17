import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly", "yearly"];

const QUICK_TEMPLATES = [
  { title: "Salary", type: "income", icon: "💰", frequency: "monthly" },
  { title: "Rent", type: "expense", icon: "🏠", frequency: "monthly" },
  { title: "Netflix", type: "expense", icon: "🎬", frequency: "monthly" },
  { title: "EMI", type: "expense", icon: "🏦", frequency: "monthly" },
  { title: "Groceries", type: "expense", icon: "🛒", frequency: "weekly" },
  { title: "Gym", type: "expense", icon: "💪", frequency: "monthly" },
];

const AddRecurringForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    icon: "",
    frequency: "monthly",
    startDate: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const applyTemplate = (template) => {
    setForm((prev) => ({
      ...prev,
      type: template.type,
      title: template.title,
      icon: template.icon,
      frequency: template.frequency,
    }));
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
          Quick Templates
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => applyTemplate(t)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
            >
              <span>{t.icon}</span> {t.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        {["income", "expense"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleChange("type", t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors cursor-pointer ${
              form.type === t
                ? t === "income"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-red-500 text-white border-red-500"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <EmojiPickerPopup
        icon={form.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={form.title}
        onChange={({ target }) => handleChange("title", target.value)}
        label={form.type === "income" ? "Source / Title" : "Category / Title"}
        placeholder="e.g. Netflix, Salary, EMI"
        type="text"
      />
      <Input
        value={form.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount (₹)"
        placeholder="1200"
        type="number"
      />
      <div className="mb-4 mt-3">
        <label className="text-xs text-gray-700 font-medium block mb-2">Frequency</label>
        <div className="flex gap-2 flex-wrap">
          {FREQUENCY_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleChange("frequency", f)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-colors cursor-pointer ${
                form.frequency === f
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Input
        value={form.startDate}
        onChange={({ target }) => handleChange("startDate", target.value)}
        label="Start Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAdd(form)}
        >
          Add Recurring
        </button>
      </div>
    </div>
  );
};

export default AddRecurringForm;
