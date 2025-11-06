const express = require('express');
const router = express.Router();
const userController = require('../controllers/profileControoller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/avatar');

router.get('/', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, upload.single('avatar_img'), userController.updateProfile);


module.exports = router;