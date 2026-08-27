import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useCurrency } from "../../context/CurrencyContext";

const GOAL_TEMPLATES = [
  { title: "Emergency Fund", target: 100000, category: "Savings", icon: "🛡️" },
  { title: "New iPhone / Phone", target: 80000, category: "Gadgets", icon: "📱" },
  { title: "Vacation / Trip", target: 50000, category: "Travel", icon: "🏖️" },
  { title: "Laptop", target: 90000, category: "Work", icon: "💻" },
  { title: "Vehicle / Bike", target: 120000, category: "Transport", icon: "🏍️" },
  { title: "Home Renovation", target: 200000, category: "Home", icon: "🏡" },
];

const AddGoalModal = ({ onSave }) => {
  const { currency } = useCurrency();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("General");
  const [icon, setIcon] = useState("🎯");

  const applyTemplate = (t) => {
    setTitle(t.title);
    setTargetAmount(t.target);
    setCategory(t.category);
    setIcon(t.icon);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0) return;
    onSave({
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      deadline: deadline || null,
      category: category.trim() || "General",
      icon,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 dark:text-gray-400 font-semibold mb-2 block uppercase tracking-wider">
          Quick Templates
        </label>
        <div className="flex flex-wrap gap-1.5">
          {GOAL_TEMPLATES.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => applyTemplate(t)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#161616] text-slate-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-[#202020] transition-colors cursor-pointer"
            >
              <span>{t.icon}</span> {t.title}
            </button>
          ))}
        </div>
      </div>

      <EmojiPickerPopup icon={icon} onSelect={(ic) => setIcon(ic)} />

      <Input
        label="Goal Title"
        placeholder="e.g. MacBook Pro, Bali Trip, Emergency Fund"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        type="text"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label={`Target Amount (${currency.symbol})`}
          placeholder="100000"
          value={targetAmount}
          onChange={({ target }) => setTargetAmount(target.value)}
          type="number"
        />

        <Input
          label={`Already Saved (${currency.symbol})`}
          placeholder="0"
          value={currentAmount}
          onChange={({ target }) => setCurrentAmount(target.value)}
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Category"
          placeholder="e.g. Travel, Gadgets, Health"
          value={category}
          onChange={({ target }) => setCategory(target.value)}
          type="text"
        />

        <Input
          label="Target Date (Optional)"
          value={deadline}
          onChange={({ target }) => setDeadline(target.value)}
          type="date"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="add-btn add-btn-fill px-5 py-2.5 rounded-xl font-medium cursor-pointer"
        >
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default AddGoalModal;
