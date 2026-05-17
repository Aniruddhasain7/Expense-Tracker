const mongoose = require("mongoose");

const RecurringTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    icon: { type: String },
    category: { type: String },
    source: { type: String },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    startDate: { type: Date, required: true },
    nextDueDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    lastProcessed: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecurringTransaction", RecurringTransactionSchema);
