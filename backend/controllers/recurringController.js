const RecurringTransaction = require("../models/RecurringTransaction");
const Expense = require("../models/Expense");
const Income = require("../models/Income");


const computeNextDue = (date, frequency) => {
  const d = new Date(date);
  switch (frequency) {
    case "daily":   d.setDate(d.getDate() + 1); break;
    case "weekly":  d.setDate(d.getDate() + 7); break;
    case "monthly": d.setMonth(d.getMonth() + 1); break;
    case "yearly":  d.setFullYear(d.getFullYear() + 1); break;
    default:        d.setMonth(d.getMonth() + 1);
  }
  return d;
};


exports.createRecurring = async (req, res) => {
  try {
    const { type, title, amount, icon, category, source, frequency, startDate } = req.body;

    if (!type || !title || !amount || !startDate) {
      return res.status(400).json({ message: "type, title, amount and startDate are required" });
    }

    const start = new Date(startDate);
    const recurring = await RecurringTransaction.create({
      userId: req.user._id,
      type,
      title,
      amount,
      icon,
      category: category || title,
      source: source || title,
      frequency: frequency || "monthly",
      startDate: start,
      nextDueDate: start,
      isActive: true,
    });

    res.status(201).json(recurring);
  } catch (error) {
    console.error("CREATE RECURRING ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getAllRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateRecurring = async (req, res) => {
  try {
    const updated = await RecurringTransaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteRecurring = async (req, res) => {
  try {
    await RecurringTransaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.processDueRecurring = async (req, res) => {
  try {
    const now = new Date();
    const dueItems = await RecurringTransaction.find({
      userId: req.user._id,
      isActive: true,
      nextDueDate: { $lte: now },
    });

    const created = [];

    for (const item of dueItems) {
      if (item.type === "expense") {
        const entry = await Expense.create({
          userId: item.userId,
          icon: item.icon,
          category: item.category || item.title,
          amount: item.amount,
          date: item.nextDueDate,
        });
        created.push({ type: "expense", entry });
      } else {
        const entry = await Income.create({
          userId: item.userId,
          icon: item.icon,
          source: item.source || item.title,
          amount: item.amount,
          date: item.nextDueDate,
        });
        created.push({ type: "income", entry });
      }


      item.lastProcessed = item.nextDueDate;
      item.nextDueDate = computeNextDue(item.nextDueDate, item.frequency);
      await item.save();
    }

    res.status(200).json({ processed: created.length, entries: created });
  } catch (error) {
    console.error("PROCESS RECURRING ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
