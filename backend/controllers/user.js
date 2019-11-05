const request = require('superagent');
const jwt = require('jsonwebtoken');
const UserInfo = require('../models/user-info');
const User = require('../models/user');

exports.githubSignIn = (req, res, next) => {
  const { query } = req.body;
  const code = req.body.code;

  if(!code) {
    return res.send({
      success: false,
      message: 'Error: no code'
    });
  }

  // Post
  console.log('code: ', code);
  request
    .post('https://github.com/login/oauth/access_token')
    .send({
      client_id: '8eee574d84d9fd8f73bd',
      client_secret: '530d3713b14ed6e52b40d0c0200dfcc7fa6f0673',
      code: code
    })
    .set('X-API-Key', 'foobar')
    .set('Accept', 'application/json')
    .then(result => {
      const data = result.body;
      res.send(data);
    });


};

exports.githubUser = (req, res, next) => {

  const accessToken = req.body.token;

  request
    .get('https://api.github.com/user')
    .set('Authorization', 'token ' + accessToken)
    .set('user-agent', 'node.js')
    .then(result => {
      res.send(result.body);
    })
    .catch((error) => {
      console.log('*** error ****', error);
    });
};


exports.saveUserInfo = (req, res, next) => {
  const query = { userId: req.body.id };
  const data = { userId: req.body.id };
  let fetchedUser;
  const userInfo = {
    userId: req.body.id,
    name: req.body.name,
    login: req.body.login,
    location: req.body.location,
    bio: req.body.bio,
  };
  UserInfo.findOneAndUpdate(query, userInfo, { upsert: true }, (err, user) => {
    if (err){
      console.log('err : ', err);
      return res.status(401).json({
        message: 'Cannot save user info'
      });
    }else{
      console.log('user : ', user);
      res.status(201).json({
        message: 'User info saved successfully',
        user: user
      });
      fetchedUser = user;
    }
  });
};

exports.getAllUsersInfo = (req, res, next) => {
  UserInfo.find().then(documents => {
      res.status(200).json({ // retrieve all posts from db
        message: 'Users info fetched successfully!',
        posts: documents
      })
    })
    .catch(err => {
      console.log('err', err);
      return res.status(401).json({
        message: 'Cannot find user info'
      });
    });
};

exports.getUserInfoById = (req, res, next) => {

};

exports.saveUser = (req, res, next) => {
  const query = { userId: req.body.id };
  const data = { userId: req.body.id };
  let fetchedUser;
  const user = {
    userId: req.body.id,
    name: req.body.name,
    login: req.body.login,
  };
  User.findOneAndUpdate(query, user, { upsert: true }, (err, user) => {
    if (err){
      console.log('err', err);
      return res.status(401).json({
        message: 'Cannot save user'
      });
    }else{
      console.log("score succeded");
      res.status(201).json({
        message: 'User saved successfully',
        user: user
      });
      fetchedUser = user;
    }
  });

};

exports.getAllUsers = (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({ // retrieve all posts from db
      message: 'Users fetched successfully!',
      posts: documents
    });
  });
};

exports.getUserById = (req, res, next) => {

};
