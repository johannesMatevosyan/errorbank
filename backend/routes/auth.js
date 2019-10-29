const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signin/callback', authController.githubSignIn);

router.post('/github/token', authController.githubUser);

module.exports = router;
