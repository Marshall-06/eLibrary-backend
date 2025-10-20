const Highlight = require("../models/model").Highlight;

exports.createHighlight = async (req, res) => {
  try {
    const { userId, bookId, pageNumber, text } = req.body;
    if (!userId || !bookId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const highlight = await Highlight.create({ userId, bookId, pageNumber, text });
    res.status(201).json({ message: "Highlight saved", highlight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHighlights = async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const highlights = await Highlight.findAll({ where: { userId, bookId } });
    res.json(highlights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHighlight = async (req, res) => {
  try {
    const deleted = await Highlight.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.json({ message: "Highlight deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
