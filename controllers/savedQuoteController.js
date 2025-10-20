const SavedQuote = require("../models/model").SavedQuote;
const fs = require("fs");
const path = require("path");

exports.saveQuote = async (req, res) => {
  try {
    const { userId, bookId, text, pageNumber } = req.body;

    if (!userId || !bookId || !text) {
      return res.status(400).json({ error: "userId, bookId, and text are required" });
    }

    // Step 1: Save to database
    const saved = await SavedQuote.create({
      userId,
      bookId,
      text,
      pageNumber,
    });

    // Step 2: Save to storage folder as text file
    const storageDir = path.join(__dirname, "..", "storage", "quotes");

    // Ensure folder exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Example: storage/quotes/user_1_quote_5.txt
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

    // Step 3: Send response
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

    // Construct file path
    const filePath = path.join(
      __dirname,
      "..",
      "storage",
      "quotes",
      `user_${userId}_quote_${quoteId}.txt`
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Send the file as a download
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error reading quote file", error: err.message });
  }
};