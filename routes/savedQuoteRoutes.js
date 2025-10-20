const express = require("express");
const router = express.Router();
const savedQuoteController = require("../controllers/savedQuoteController");

router.post("/", savedQuoteController.saveQuote);
router.get("/:userId", savedQuoteController.getUserQuotes);
router.delete("/:id", savedQuoteController.deleteQuote);
router.get("/file/:userId/:quoteId", savedQuoteController.getQuoteFile);


module.exports = router;
