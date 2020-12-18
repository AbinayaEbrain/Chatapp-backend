const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  posts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      post: { type: String },
      created: { type: Date, default: Date.now() }
    }
  ],
  following: [
    //id of the following user by us
    { userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }
  ],
  followers: [
    //id of the user who is following us
    { follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }
  ],
  notifications: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //loggedUser id
      message: { type: String }, //notifications msg
      viewProfile: { type: Boolean, default: false }, //if the user viewed our profile,then set it to true
      created: { type: Date, default: Date.now() },
      read: { type: Boolean, default: false }, //if the user read the notification then set it to true
      date: { type: String, default: '' }
    }
  ],
  // In chatList,specify the id of the user with whom we are chating
  chatList: [
    {
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Id of the receiver
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
    }
  ],
  picVersion: { type: String, default: '' },
  picId: { type: String, default: '' },
  images: [
    {
      imgId: { type: String, default: '' },
      imgVersion: { type: String, default: '' }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
