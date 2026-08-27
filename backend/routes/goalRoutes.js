const express = require("express");
const router = express.Router();

const {
  createGoal,
  getGoals,
  depositToGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createGoal);
router.get("/get", protect, getGoals);
router.put("/:id/deposit", protect, depositToGoal);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);

module.exports = router;
