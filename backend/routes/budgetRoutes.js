const express = require("express");
const router = express.Router();

const {
  setBudget,
  getBudgets,
  deleteBudget,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

router.post("/set", protect, setBudget);
router.get("/get", protect, getBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
