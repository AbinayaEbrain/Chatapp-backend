const express = require('express');
const router = express.Router();

const imageController = require('../controllers/images');
const authHelpers = require('../Helpers/authHelper');

router.post(
  '/upload-image',
  authHelpers.verifyToken,
  imageController.uploadImage
);

module.exports = router;
