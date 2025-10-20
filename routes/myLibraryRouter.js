const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getMyLibrary } = require("../controllers/myLibraryController");

router.get("/", authMiddleware, getMyLibrary);

module.exports = router;
