const express = require('express');

const postsController = require('../controllers/post');

const router = express.Router();

router.post('/create', postsController.createPost);

router.get('/get-all', postsController.getPosts);

router.get('/get-id/:id', postsController.getPostById);

router.post('/update/:id', postsController.editPostById);

router.delete('/delete/:id', postsController.deletePostById);

module.exports = router;
