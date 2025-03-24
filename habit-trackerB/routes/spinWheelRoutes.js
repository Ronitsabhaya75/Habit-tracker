const express = require('express');
const { spinWheel } = require('../controllers/spinWheelController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Spin the wheel to earn XP
router.post('/', verifyToken, spinWheel);

module.exports = router;