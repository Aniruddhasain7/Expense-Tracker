const express = require("express");
const { uploadReceipt } = require("../controllers/receiptController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", protect, uploadReceipt);

module.exports = router;
