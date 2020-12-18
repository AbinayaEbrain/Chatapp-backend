const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  participants: [
    {
      // Below 2 id's will set when 2 users start the conversation.
      // When a new msg comes,we are going to check that 2 id's exist
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ]
});

module.exports = mongoose.model('conversation', conversationSchema);
