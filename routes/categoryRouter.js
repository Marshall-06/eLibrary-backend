const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


router.get("/", categoryController.getAllCategories);
router.get("/single/:id", categoryController.getSingleCategory);
router.post("/add",authMiddleware, adminOnly, categoryController.addCategory);
router.put("/update/:id",authMiddleware, adminOnly, categoryController.updateCategory);
router.delete("/delete/:id",authMiddleware, adminOnly, categoryController.deleteCategory);

module.exports = router;
