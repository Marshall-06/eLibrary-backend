const express = require('express');
const router = express.Router();
const audioUpload = require("../middlewares/audio")
const {Category, Audiobook} = require("../models/model")
const path = require("path");
const fs = require('fs');
const multer = require("multer")


router.post(
    '/create',
    audioUpload.single('audio'),
    async (req, res) => {
      try {
        const { name, description, categoryId } = req.body;
  
        // 🧩 Validation
        if (!name || !description || !categoryId) {
          return res.status(400).json({
            error: 'Title, Description, Author, and Category are required'
          });
        }
  
        if (!req.file) {
          return res.status(400).json({ error: 'Audio file is required' });
        }
  
        // 🧩 Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        // 🧩 Create audiobook
        const fileBaseUrl = `${req.protocol}://${req.get('host')}/uploads/audios`;
        const audiobook = await Audiobook.create({
          name,
          description,
          categoryId,
          audio: req.file.filename
        });
  
        // ✅ Response
        res.status(201).json({
          message: 'Audiobook uploaded successfully',
          data: {
            id: audiobook.id,
            name: audiobook.name,
            description: audiobook.description,
            categoryId: audiobook.categoryId,
            audio: `${fileBaseUrl}/${audiobook.audio}`,
            createdAt: audiobook.createdAt,
            updatedAt: audiobook.updatedAt
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  
  
  router.get('/', async (req, res) => {
    try {
      const audios = await Audiobook.findAll({
        include: [{ model: Category, attributes: ['name'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ data: audios });
    } catch (err) {
      res.status(500).json({ message: 'List error', error: err.message });
    }
  });

  router.get("/single/:id", async (req, res) => {
    const audio = await Audiobook.findByPk(req.params.id);
    if (!audio) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(audio);
  })

//   router.get('/download/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const audio = await Audiobook.findByPk(id);
//       if (!audio) return res.status(404).json({ message: 'Audiobook not found' });
  
//       const filePath = path.join(__dirname, '..', 'uploads', 'audios', audio.audio);
//       res.download(filePath);
//     } catch (err) {
//       res.status(500).json({ message: 'Download error', error: err.message });
//     }
//   });
router.get("/download/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // 1️⃣ Find audio by ID
      const audio = await Audiobook.findByPk(id);
      if (!audio) {
        return res.status(404).json({ message: "Audio not found" });
      }
  
      // 2️⃣ Define source and destination paths
      const sourcePath = path.join(__dirname, "..", "uploads", "audios", audio.audio); // <-- audio filename
      const destDir = path.join(__dirname, "..", "storage", "audios"); // folder inside app
  
      // 3️⃣ Create storage folder if not exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
  
      // 4️⃣ Copy file to storage
      const destPath = path.join(destDir, audio.audio);
      fs.copyFileSync(sourcePath, destPath);
  
      // 5️⃣ Respond success
      res.json({
        message: "Audio saved to app storage successfully",
        path: destPath,
      });
    } catch (err) {
      res.status(500).json({ message: "Error saving audio", error: err.message });
    }
  });


  router.put('/update/:id', audioUpload.single('audio'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, categoryId } = req.body;
  
      // Find the audiobook
      const audioBook = await Audiobook.findByPk(id);
      if (!audioBook) return res.status(404).json({ message: 'Audiobook not found' });
  
      // Validate category if provided
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        audioBook.categoryId = categoryId;
      }
  
      // Update fields if provided
      if (name) audioBook.name = name;
      if (description) audioBook.description = description;
  
      // Update audio file if new file uploaded
      if (req.file) {
        // Optional: delete old file from uploads
        const oldFile = path.join(__dirname, '..', 'uploads', 'audios', audioBook.audio);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
  
        audioBook.audio = req.file.filename;
      }
  
      await audioBook.save();
  
      const fileBaseUrl = `${req.protocol}://${req.get('host')}/uploads/audios`;
      res.json({
        message: 'Audiobook updated successfully',
        data: {
          id: audioBook.id,
          name: audioBook.name,
          description: audioBook.description,
          categoryId: audioBook.categoryId,
          audio: `${fileBaseUrl}/${audioBook.audio}`,
          updatedAt: audioBook.updatedAt
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Error updating audiobook', error: err.message });
    }
  });

module.exports = router;