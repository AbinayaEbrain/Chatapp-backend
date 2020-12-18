const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/register', authController.createUser);
router.post('/login', authController.LoginUser);

module.exports = router;
