const SavedQuote = require("../models/model").SavedQuote;
const fs = require("fs");
const path = require("path");

exports.saveQuote = async (req, res) => {
  try {
    const { userId, bookId, text, pageNumber } = req.body;

    if (!userId || !bookId || !text) {
      return res.status(400).json({ error: "userId, bookId, and text are required" });
    }

    const saved = await SavedQuote.create({
      userId,
      bookId,
      text,
      pageNumber,
    });

    const storageDir = path.join(__dirname, "..", "storage", "quotes");

    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const fileName = `user_${userId}_quote_${saved.id}.txt`;
    const filePath = path.join(storageDir, fileName);

    const fileContent = [
      `Quote ID: ${saved.id}`,
      `User ID: ${userId}`,
      `Book ID: ${bookId}`,
      `Page Number: ${pageNumber || "N/A"}`,
      "",
      `"${text}"`,
      "",
      `Saved on: ${new Date().toLocaleString()}`
    ].join("\n");

    fs.writeFileSync(filePath, fileContent, "utf8");
    res.status(201).json({
      message: "Quote saved successfully to database and storage",
      saved,
      filePath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getUserQuotes = async (req, res) => {
  try {
    const { userId } = req.params;
    const quotes = await SavedQuote.findAll({ where: { userId } });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SavedQuote.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.json({ message: "Quote deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQuoteFile = async (req, res) => {
  try {
    const { userId, quoteId } = req.params;

    const filePath = path.join(
      __dirname,
      "..",
      "storage",
      "quotes",
      `user_${userId}_quote_${quoteId}.txt`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error reading quote file", error: err.message });
  }
};