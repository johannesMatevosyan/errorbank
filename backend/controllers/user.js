const request = require('superagent');
const jwt = require('jsonwebtoken');
const UserInfo = require('../models/user-info');
const User = require('../models/user');
const Post = require('../models/post');
const mongoose = require('mongoose')
const transformPost = require('../utils/transform-post');
const addCommentNumber = require('../utils/add-comment-number');

exports.githubSignIn = (req, res, next) => {
  const code = req.body.code;

  if(!code) {
    return res.send({
      success: false,
      message: 'Error: no code'
    });
  }
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

exports.getJWTToken = (req, res, next) => {
  let ID = req.body.id.toString();
  UserInfo.findOne({ githubId: ID })
    .then(user => {

      if (!user) {
        return res.status(401).json({
          message: 'User not found.',
        });
      }

      const token = jwt.sign({ // create token based on input
          id: user._id,
          login: user.login
        },
        process.env.JWT_KEY,
        {expiresIn: '1h'}
      );

      res.status(201).json({
        message: 'User created!',
        token: token,
        expiresIn: 3600,
        userData:  user,
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth Failed'
      });
    });

};


exports.saveUserInfo = (req, res, next) => {

  const query = { githubId: req.body.githubId };
  let fetchedUser;
  const userInfo = {
    githubId: req.body.githubId,
    name: req.body.name,
    login: req.body.login,
    location: req.body.location,
    bio: req.body.bio,
    date: req.body.date,
  };
  UserInfo.findOneAndUpdate(query, userInfo, { upsert: true }, (err, user) => {
    if (err){
      return res.status(401).json({
        message: 'Cannot save user info!'
      });
    } else {
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
        users: documents
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Cannot find user info'
      });
    });
};

exports.getUserInfoById = (req, res, next) => {
  const userId = req.params.id;
  if(userId !== 'undefined' && userId !== null) {
    UserInfo.findOne({ _id: userId }).then(singleUser => {
      if (!singleUser){
        return res.status(401).json({
          message: `Cannot find user info by id: ${userId}`,
        });
      } else {
        res.status(200).json({
          message: `User info with id:::${userId} fetched successfully! `,
          user: singleUser
        });
      }

    })
      .catch(err => {
        return res.status(401).json({
          message: `Cannot find user info with id: ${userId} - error:  ${err}`
        });
      });

  }
};

exports.saveUser = (req, res, next) => {
  const query = { githubId: req.body.githubId };
  let fetchedUser;
  const user = {
    githubId: req.body.githubId,
    name: req.body.name,
    login: req.body.login,
  };
  User.findOneAndUpdate(query, user, { upsert: true }, (err, user) => {
    if (err){
      return res.status(401).json({
        message: 'Cannot save user: ' + err,
      });
    }else{
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
      users: documents
    });
  });
};

exports.getUserById = (req, res, next) => {
  const userId = req.params.id;
  if(userId !== 'undefined' && userId !== null) {
    User.findOne({ _id: userId }).then(singleUser => {
      if (!singleUser){
        return res.status(401).json({
          message: `Cannot find user by id: ${userId}`,
        });
      } else {
        res.status(200).json({
          message: `User with id:::${userId} fetched successfully! `,
          user: singleUser
        });
      }

    })
      .catch(err => {
        return res.status(401).json({
          message: `Cannot find user with id: ${userId} - error:  ${err}`
        });
      });

  }

};


/*** Get posts by User Id ***/

exports.getPostsByAuthorId = (req, res, next) => {

  const userId = req.params.id;
  let transformedPost;
  let postWithComments = [];

  if(userId !== 'undefined' && userId !== null) {
    const postQuery = Post.find({ authorId: userId })
      .populate('authorId', 'name')
      .populate('voteId', 'votes')
      .populate('tags', 'label');

    postQuery
      .then((posts) => {
        transformedPost = transformPost.newPost(posts);

        return Post.aggregate([
          {
            $lookup: {
              from: "comments", localField: "_id", foreignField: "postId", as: "postComments"
            }
          },
          {
            $project: {
              "numOfComments":{ $size: "$postComments" }
            }
          }
        ]).exec((err, commentsArr) => {

          postWithComments = addCommentNumber.addCommentCount(transformedPost, commentsArr);

          res.status(200).json({
            message: `Posts with user id:${userId} fetched successfully !`,
            posts: postWithComments
          });

        });

      });
  }

};

exports.setFavoritePosts = (req, res, next) => {

  let userId = req.body.userId;
  let postId = req.body.postId;
  let pull = { $pull: { favourites: postId } };
  let push = { $push: { favourites: [postId] } };
  let pullQuery = UserInfo.updateOne({ _id: userId }, pull );
  let pushQuery = UserInfo.updateOne({ _id: userId }, push );
  let user = UserInfo.exists({ _id: userId });
  let usersPost = UserInfo.findOne({ favourites: postId });

  user.then(isUserFound => {

    if (isUserFound) {

      usersPost.then(isPostFound => {

        if (isPostFound !== null) {
          pullQuery.then(result => {
            res.status(200).json({
              message: `Favorite post id removed from DB!`
            });
          });
        } else {
          pushQuery.then(result => {
            res.status(200).json({
              message: `Favorite post id pushed to DB!`
            });
          });
        }
      });

    }

  }).catch(error => {
    res.status(500).json({
      message: "Failed to add favorite post : " + error,
    });
  });


};

exports.getFavoritePosts = (req, res, next) => {

  let transformedPost;
  let favouritePosts = [];

  UserInfo.findById( mongoose.Types.ObjectId(req.params.id))
    .then(user => {

      return Post.find({ _id: { $in: user.favourites } })
        .populate('authorId', 'name')
        .populate('voteId', 'votes')
        .populate('tags', 'label')
        .then((posts) => {
          transformedPost = transformPost.newPost(posts);

          return Post.aggregate([
            {
              $lookup: {
                from: "comments", localField: "_id", foreignField: "postId", as: "postComments"
              }
            },
            {
              $project: {
                "numOfComments":{ $size: "$postComments" }
              }
            }
          ]).exec((err, commentsArr) => {

            favouritePosts = addCommentNumber.addCommentCount(transformedPost, commentsArr);
            res.status(200).json({
              message: 'User\s favourite posts are fetched successfully!',
              favouritePosts
            });

          });

        });
    })
    .catch((err)=> {
      return res.status(401).json({
        message: 'Something went wrong. ' + err,
      });
    });
};
