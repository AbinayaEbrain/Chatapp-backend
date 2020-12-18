const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authHelpers = require('../Helpers/authHelper');

router.get('/users', authHelpers.verifyToken, userController.getAllUsers);
router.get('/users/:id', authHelpers.verifyToken, userController.getUser);
router.get(
  '/username/:username',
  authHelpers.verifyToken,
  userController.getUserByName
);

module.exports = router;
