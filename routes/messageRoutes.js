const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');
const authHelpers = require('../Helpers/authHelper');

router.post(
  '/chat-messages/:sender_Id/:receiver_Id',
  authHelpers.verifyToken,
  messageController.sendMessage
);

router.get(
  '/chat-messages/:sender_Id/:receiver_Id',
  authHelpers.verifyToken,
  messageController.getAllMessages
);

router.get(
  '/mark-all-messages',
  authHelpers.verifyToken,
  messageController.markAllMessages
);

router.get(
  '/receiver-messages/:sender/:receiver',
  authHelpers.verifyToken,
  messageController.markReceiverMessage
);

module.exports = router;
