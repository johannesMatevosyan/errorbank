const express = require('express');
const postsInfoController = require('../controllers/post-info');
const router = express.Router();

router.get('/get-by-id/:id', postsInfoController.getPostCommentInfoById);

router.post('/vote-for-post/:id', postsInfoController.voteForPostById);

module.exports = router;
