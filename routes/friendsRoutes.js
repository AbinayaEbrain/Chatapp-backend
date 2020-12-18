const express = require('express');
const router = express.Router();

const friendController = require('../controllers/friends');
const authHelpers = require('../Helpers/authHelper');

router.post(
  '/follow-user',
  authHelpers.verifyToken,
  friendController.followUser
);
router.post(
  '/unfollow-user',
  authHelpers.verifyToken,
  friendController.unFollowUser
);
router.post(
  '/mark/:id',
  authHelpers.verifyToken,
  friendController.markNotifications
);
router.post(
  '/mark-all',
  authHelpers.verifyToken,
  friendController.markAllNotifications
);

module.exports = router;
