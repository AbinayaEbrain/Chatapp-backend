const User = require('../models/userModels');

module.exports = {
  async getAllUsers(req, res) {
    //find() going to return all data from User
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      // .populate('chatList.receiverId')
      // .populate('chatList.messageId')
      .then(result => {
        // console.log(result);
        res.status(200).json({ message: 'All users', result });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  async getUser(req, res) {
    await User.findOne({ _id: req.params.id })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.messageId')
      .then(result => {
        // console.log(result);
        res.status(200).json({ message: 'User by id', result });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  async getUserByName(req, res) {
    await User.findOne({ username: req.params.username })
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.messageId')
      .then(result => {
        res.status(200).json({ message: 'User by username', result });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  }
};
