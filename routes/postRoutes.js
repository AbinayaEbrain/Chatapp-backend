const express = require('express');
const router = express.Router();

//require the controller
const postController = require('../controllers/post');
const authHelpers = require('../Helpers/authHelper');

//below line will set the path and call the two functions
router.get('/posts', authHelpers.verifyToken, postController.getAllPosts);
router.get('/post/:id', authHelpers.verifyToken, postController.getPost);

router.post('/post/add-post', authHelpers.verifyToken, postController.addPost);
router.post('/post/add-like', authHelpers.verifyToken, postController.addLike);
router.post(
  '/post/add-comment',
  authHelpers.verifyToken,
  postController.addComment
);

//exports the router to use in another file
module.exports = router;
