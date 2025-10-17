const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/pdfs/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    // unique hash + original extension (.pdf, .jpg, etc.)
    const uniqueName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const pdfUpload = multer({ storage });

module.exports = pdfUpload;
