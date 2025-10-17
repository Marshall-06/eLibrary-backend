// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");

// const audioStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(__dirname, '..', 'uploads', 'audios');
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = `${Date.now()}-${file.originalname}`;
//       cb(null, uniqueName);
//     }
//   });
  
//   const audioUpload = multer({ storage: audioStorage });

// // const upload = multer({ storage });

// module.exports = audioUpload;

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/audios/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    // unique hash + original extension (.pdf, .jpg, etc.)
    const uniqueName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const audioUpload = multer({ storage });

module.exports = audioUpload;
