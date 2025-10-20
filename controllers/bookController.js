const path = require("path");
const fs = require("fs");
const Book = require("../models/model").Book;
const Category = require("../models/model").Category

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBook = async (req, res) => {
  const { name, description, categoryId, userId } = req.body;

  if (!name || !description || !categoryId || !userId) {
    return res.status(400).json({ error: "Name, Description, and Category are required" });
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
      userId,
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
        userId: book.userId,
        image: `${fileBaseUrl}/${book.image}`,
        pdf: `${fileBaseUrl}/${book.pdf}`,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const { name, description, categoryId, userId } = req.body;
    if (!name || !description || !userId)  {
      return res.status(400).json({ error: "Name and Description are required" });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json({ error: "Category not found" });
    }

    // Replace files if new ones are uploaded
    if (req.files.image) book.image = req.files.image[0].filename;
    if (req.files.pdf) book.pdf = req.files.pdf[0].filename;

    book.name = name;
    book.description = description;
    book.userId = userId;
    book.categoryId = categoryId || book.categoryId;

    await book.save();

    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const sourcePath = path.join(__dirname, "..", "uploads", "pdfs", book.pdf);
    const destDir = path.join(__dirname, "..", "storage", "pdfs");

    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const destPath = path.join(destDir, book.pdf);
    fs.copyFileSync(sourcePath, destPath);

    res.json({ message: "Book saved to app storage", path: destPath });
  } catch (err) {
    res.status(500).json({ message: "Error saving book", error: err.message });
  }
};