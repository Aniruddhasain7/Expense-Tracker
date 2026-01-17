const xlsx = require("xlsx");
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = await Income.create({
      userId: req.user._id, 
      icon,
      source,
      amount,
      date: new Date(date),
    });

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("ADD INCOME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json(income);
  } catch (error) {
    console.error("GET INCOME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  try {
    const income = await Income.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = "income_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
