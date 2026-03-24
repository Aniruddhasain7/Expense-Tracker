const xlsx = require("xlsx");
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = await Expense.create({
      userId: req.user._id,   
      icon,
      category,
      amount,
      date: new Date(date),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllExpense = async (req, res) => {
  try {
    const expense = await Expense.find({
      userId: req.user._id,
    }).sort({ date: -1 });   

    res.status(200).json(expense);
  } catch (error) {
    console.error("GET EXPENSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expense = await Expense.find({
      userId: req.user._id,
    }).sort({ date: -1 });   

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
