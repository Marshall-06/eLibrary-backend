const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');
const { Book, Category } = require('../models/model');
const pdfUpload = require("../middlewares/pdf");
// const {authMiddleware, adminOnly} = require ("../middlewares/authMiddleware")

router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get("/single/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
})

router.post(
  "/create",
  pdfUpload.fields([{ name: "image" }, { name: "pdf" }]),
  async (req, res) => {
    const { name, description, categoryId } = req.body;

    if (!name || !description || !categoryId) {
      return res.status(400).json({ error: "Name, Description, Category required" });
    }

    if (!req.files || !req.files.image || !req.files.pdf) {
      return res.status(400).json({ error: "PDF and Image are required" });
    }

    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const fileBaseUrl = `${req.protocol}://${req.get("host")}/uploads`;

      const book = await Book.create({
        name,
        description,
        categoryId,
        image: req.files.image[0].filename,
        pdf: req.files.pdf[0].filename,
      });

      res.status(201).json({
        message: "Book uploaded successfully",
        data: {
          id: book.id,
          name: book.name,
          description: book.description,
          categoryId: book.categoryId,
          image: `${fileBaseUrl}/${book.image}`, // ✅ full URL
          pdf: `${fileBaseUrl}/${book.pdf}`,     // ✅ full URL
          createdAt: book.createdAt,
          updatedAt: book.updatedAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);





router.put("/update/:id", pdfUpload.fields([{ name: "pdf" }, { name: "image" }]), async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const { name, description, categoryId } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Name and Description are required" });
  }
  if (req.files.image) {
    book.image = req.files.image[0].filename;
  }
  if (req.files.pdf) {
    book.pdf = req.files.pdf[0].filename;
  }
  if (categoryId) {
    const category = await Category.findByPk;
    if (!category) return res.status(400).json({ error: "Category not found" });
  }
  book.name = name;
  book.description = description;
  book.categoryId = categoryId || book.categoryId ;
  pdf = req.files.pdf ? req.files.pdf[0].filename : book.pdf
  image = req.files.image ? req.files.image[0].filename : book.image
  await book.save();
  res.json({ message: "Book updated successfully", book });
})

router.delete("/delete/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  await book.destroy();
  res.json({ message: "Book deleted successfully" });
})


router.get('/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const sourcePath = path.join(__dirname, '..', 'uploads', 'pdfs', book.pdf);
    const destDir = path.join(__dirname, "..", "storage", "pdfs"); // folder inside app
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const destPath = path.join(destDir, book.pdf);
    fs.copyFileSync(sourcePath, destPath);

    res.json({ message: 'Book saved to app storage', path: destPath });
  } catch (err) {
    res.status(500).json({ message: 'Error saving book', error: err.message });
  }
});



module.exports = router