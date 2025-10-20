const path = require("path");
const fs = require("fs");
const Category = require("../models/model").Category;
const Audiobook = require("../models/model").Audiobook
const { Op } = require("sequelize");


exports.createAudiobook = async (req, res) => {
  try {
    const { name, description, categoryId, userId } = req.body;

    if (!name || !description || !categoryId || !userId) {
      return res.status(400).json({
        error: "Title, Description, and Category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const fileBaseUrl = `${req.protocol}://${req.get("host")}/uploads/audios`;

    const audiobook = await Audiobook.create({
      name,
      description,
      categoryId,
      userId: req.user.id,
      audio: req.file.filename,
    });

    res.status(201).json({
      message: "Audiobook uploaded successfully",
      data: {
        id: audiobook.id,
        name: audiobook.name,
        description: audiobook.description,
        categoryId: audiobook.categoryId,
        audio: `${fileBaseUrl}/${audiobook.audio}`,
        createdAt: audiobook.createdAt,
        updatedAt: audiobook.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAudiobooks = async (req, res) => {
  try {
    const audios = await Audiobook.findAll({
      include: [{ model: Category, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ data: audios });
  } catch (err) {
    res.status(500).json({ message: "List error", error: err.message });
  }
};

exports.getSingleAudiobook = async (req, res) => {
  try {
    const audio = await Audiobook.findByPk(req.params.id);
    if (!audio) return res.status(404).json({ error: "Audiobook not found" });
    res.json(audio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audiobook", error: err.message });
  }
};

exports.downloadAudiobook = async (req, res) => {
  try {
    const { id } = req.params;
    const audio = await Audiobook.findByPk(id);
    if (!audio) return res.status(404).json({ message: "Audio not found" });

    const sourcePath = path.join(__dirname, "..", "uploads", "audios", audio.audio);
    const destDir = path.join(__dirname, "..", "storage", "audios");

    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const destPath = path.join(destDir, audio.audio);
    fs.copyFileSync(sourcePath, destPath);

    res.json({
      message: "Audio saved to app storage successfully",
      path: destPath,
    });
  } catch (err) {
    res.status(500).json({ message: "Error saving audio", error: err.message });
  }
};

exports.updateAudiobook = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId,userId } = req.body;

    const audioBook = await Audiobook.findByPk(id);
    if (!audioBook) return res.status(404).json({ message: "Audiobook not found" });

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(404).json({ message: "Category not found" });
      audioBook.categoryId = categoryId;
    }

    if (name) audioBook.name = name;
    if (description) audioBook.description = description;
    if (userId) audioBook.userId = userId;

    if (req.file) {
      const oldFile = path.join(__dirname, "..", "uploads", "audios", audioBook.audio);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      audioBook.audio = req.file.filename;
    }

    await audioBook.save();

    const fileBaseUrl = `${req.protocol}://${req.get("host")}/uploads/audios`;
    res.json({
      message: "Audiobook updated successfully",
      data: {
        id: audioBook.id,
        name: audioBook.name,
        description: audioBook.description,
        userId: audioBook.userId,
        categoryId: audioBook.categoryId,
        audio: `${fileBaseUrl}/${audioBook.audio}`,
        updatedAt: audioBook.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating audiobook", error: err.message });
  }
};


exports.deleteAudiobook = async (req, res) => {
  try {
    const { id } = req.params;
    const audioBook = await Audiobook.findByPk(id);
    if (!audioBook) return res.status(404).json({ message: "Audiobook not found" });

    const filePath = path.join(__dirname, "..", "uploads", "audios", audioBook.audio);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await audioBook.destroy();
    res.json({ message: "Audiobook deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting audiobook", error: err.message });
  }
};

exports.searchAudios = async (req, res) => {
  try {
    const { query } = req.query; // GET /api/audios/search?query=love

    if (!query) {
      return res.status(400).json({ error: "Please provide a search query" });
    }

    const results = await Audiobook.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: "category", // ✅ use the same alias you defined in model associations
          where: {
            name: { [Op.like]: `%${query}%` },
          },
          required: false, // ✅ allows results even if no matching category
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Search results",
      count: results.length,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
