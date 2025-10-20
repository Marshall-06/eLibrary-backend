const express = require("express");
const router = express.Router();
const audioUpload = require("../middlewares/audio");
const audioBookController = require("../controllers/audioBookController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


// Create new audiobook
router.post("/create",authMiddleware,audioUpload.single("audio"),audioBookController.createAudiobook);
router.get("/", audioBookController.getAllAudiobooks);
router.get("/single/:id", audioBookController.getSingleAudiobook);
router.get("/download/:id", audioBookController.downloadAudiobook);
router.put("/update/:id",authMiddleware,audioUpload.single("audio"),audioBookController.updateAudiobook);
router.delete("/delete/:id",authMiddleware,adminOnly, audioBookController.deleteAudiobook);
router.get("/search", audioBookController.searchAudios);



module.exports = router;
