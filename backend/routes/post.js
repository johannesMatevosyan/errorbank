const express = require('express');
const postsController = require('../controllers/post');
const commentController = require('../controllers/comment');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router = express.Router();


router.post('/create', checkAuth, extractFile, postsController.createPost);

router.post('', postsController.getAllPosts);

router.get('/get-by-date', postsController.getPostsByDate);

router.get('/get-id/:id', postsController.getPostById);

router.put('/update/:id', checkAuth, extractFile, postsController.updatePostById);

router.delete('/delete/:id', checkAuth, postsController.deletePostById);

router.post('/vote', postsController.voteForPost);

router.get('/comment/:id', commentController.getCommentsByPostID);

module.exports = router;

