const express = require("express");
const {
  createRecurring,
  getAllRecurring,
  updateRecurring,
  deleteRecurring,
  processDueRecurring,
} = require("../controllers/recurringController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRecurring);
router.get("/get", protect, getAllRecurring);
router.put("/:id", protect, updateRecurring);
router.delete("/:id", protect, deleteRecurring);
router.post("/process-due", protect, processDueRecurring);

module.exports = router;
