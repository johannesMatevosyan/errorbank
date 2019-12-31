const express = require('express');

const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user');
const notificationController = require('../controllers/notification');

const router = express.Router();

router.post('/signin/callback', userController.githubSignIn);

router.post('/github/token', userController.githubUser);

router.post('/get-jwt-token', userController.getJWTToken);

router.post('/save-user-info', userController.saveUserInfo); // +

router.get('/list-info', userController.getAllUsersInfo);

router.get('/info/:id', userController.getUserInfoById);

router.post('/save-user', userController.saveUser);

router.get('/list', userController.getAllUsers);

router.get('/profile/:id', userController.getUserById);

router.post('/posts/favourites/:id', userController.setFavoritePosts);

router.get('/posts/favourites/:id', userController.getFavoritePosts);

router.get('/posts/:id', userController.getPostsByAuthorId);

router.get('/notifications', checkAuth, notificationController.getNotifications);

module.exports = router;
