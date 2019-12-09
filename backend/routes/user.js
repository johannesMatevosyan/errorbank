const express = require('express');


const authController = require('../controllers/user');

const router = express.Router();

router.post('/signin/callback', authController.githubSignIn);

router.post('/github/token', authController.githubUser);

router.post('/get-jwt-token', authController.getJWTToken);

router.post('/save-user-info', authController.saveUserInfo); // +

router.get('/list-info', authController.getAllUsersInfo);

router.get('/info/:id', authController.getUserInfoById);

router.post('/save-user', authController.saveUser);

router.get('/list', authController.getAllUsers);

router.get('/profile/:id', authController.getUserById);

router.get('/posts/:id', authController.getPostsByAuthorId);

module.exports = router;
