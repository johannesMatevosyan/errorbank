const express = require('express');
const commentController = require('../controllers/comment');
const router = express.Router();

router.post('/create', commentController.createComment);

router.get('/get/:id', commentController.getCommentsByPostID);

module.exports = router;
