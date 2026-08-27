import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { useCurrency } from "../../context/CurrencyContext";

const AddExpenseForm = ({ onAddExpense }) => {
  const { currency } = useCurrency();
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "",
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div className="space-y-4">
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Expense Category"
        placeholder="Rent, Groceries, Food, Travel, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label={`Amount (${currency.symbol})`}
        placeholder="e.g. 1500"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="add-btn add-btn-fill px-5 py-2.5 rounded-xl font-medium cursor-pointer"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;