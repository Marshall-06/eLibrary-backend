const express = require("express");
const router = express.Router();
const highlightController = require("../controllers/highlightController");


router.post("/", highlightController.createHighlight);
router.get("/:userId/:bookId", highlightController.getHighlights);
router.delete("/:id", highlightController.deleteHighlight);

module.exports = router;
