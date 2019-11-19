const express = require('express');
const commentController = require('../controllers/comment');
const router = express.Router();

router.post('/create', commentController.createComment);

module.exports = router;
