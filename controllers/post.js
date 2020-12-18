const Joi = require('joi');
const HttpStatus = require('http-status-code');
const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = {
  addPost(req, res) {
    const schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const { error } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(400).json({ msg: error.details });
    }
    const body = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };
    Post.create(body)
      .then(async post => {
        //to update the post in user collection
        await User.update(
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: new Date()
              }
            }
          }
        );
        res.status(200).json({ message: 'Post created', post });
      })
      .catch(err => {
        return res.status(500).json({ message: 'Error occured' });
      });
  },
  //to get all posts
  async getAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        //populate method is used to get the values of user model...it can be used if we declare "ref: 'User'" in model file
        .populate('user')
        .sort({ created: -1 }); //to sort in descending order (i.e: from the latest to oldest)

      //to get top post based on totalLikes
      //gte = greater than or equal to
      const top = await Post.find({ totalLikes: { $gte: 2 } })
        .populate('user')
        .sort({ created: -1 });

      return res.status(200).json({ message: 'All posts', posts, top });
    } catch (err) {
      return res.status(500).json({ message: 'Error occured' });
    }
  },

  //to add like
  async addLike(req, res) {
    const postId = req.body._id; //post id and it can be done when passing the whole post data from posts.copnt.ts
    await Post.update(
      {
        _id: postId,
        'likes.username': { $ne: req.user.username } //$ne = not equal...allowing a single like by a user..'likes' is a array
      },
      {
        $push: {
          likes: {
            username: req.user.username //to get the name of user who like the post
          }
        },
        $inc: { totalLikes: 1 } //incrementing the like by 1
      }
    )
      .then(() => {
        res.status(200).json({ message: 'You liked the post' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  //to add comment
  async addComment(req, res) {
    const postId = req.body.postId;
    await Post.update(
      {
        _id: postId
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }
    )
      .then(() => {
        res.status(200).json({ message: 'Comment added' });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  },

  //get a post
  async getPost(req, res) {
    //to find a single post..we are using findOne method
    await Post.findOne({ _id: req.params.id })
      .populate('user')
      .populate('comments.userId')
      .then(post => {
        res.status(200).json({ message: 'Post found', post });
      })
      .catch(err => {
        res.status(500).json({ message: 'Post not found' });
      });
  }
};
