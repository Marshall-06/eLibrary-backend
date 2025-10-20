const express = require("express");
const router = express.Router();
const pdfUpload = require("../middlewares/pdf");
const bookController = require("../controllers/bookController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


router.get("/", bookController.getAllBooks);
router.get("/single/:id", bookController.getSingleBook);
router.post("/create",authMiddleware, adminOnly,pdfUpload.fields([{ name: "image" }, { name: "pdf" }]),bookController.createBook);
router.put("/update/:id",authMiddleware, adminOnly,pdfUpload.fields([{ name: "image" }, { name: "pdf" }]),bookController.updateBook);
router.delete("/delete/:id",authMiddleware, adminOnly, bookController.deleteBook);
router.get("/download/:id", bookController.downloadBook);

module.exports = router;
