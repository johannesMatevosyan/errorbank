const Comment = require('../models/comment');
const UserInfo = require('../models/user-info');
const Notification = require('../models/notification');
const transformComment = require('../utils/transform-comment');
const mongoose = require('mongoose');

exports.createComment = (req, res, next) => {
  let userId = req.body.userId;
  let commentObj = new Comment({
    text: req.body.text,
    postId: req.body.postId,
    userId: userId,
    date: req.body.date,
  });
  commentObj.save()
    .then(createdComment => {
      return UserInfo.findOne({ _id: userId }).then(user => {
        if (user) {
          let updatedComment = createdComment.toObject();
          updatedComment.userData = {
            userId: user._id,
            userName: user.login
          };
          return updatedComment;
        }
      });
    })
    .then(comment => {
      commentObj = comment;
      mongoose.set('debug', true);
      return UserInfo.find({ favourites: comment.postId });
    })
    .then(users => {
      if (users.length) {
        const notifications = [];
        users.forEach(user => {
          const notification = Notification.create({
            postId: commentObj.postId,
            userId: user._id,
            commentId: commentObj._id
          });
          notifications.push(notification);
        });
        Promise.all(notifications);
      }
    })
    .then(() => {
      res.status(201).json({
        message: 'Comment added successfully',
        comment: commentObj,
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Cannot add Comment : ' + err
      });
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.id;
  Comment
    .deleteOne({ _id: commentId })
    .then(() => {
      res.end();
    })
    .catch(err => {
      return res.status(404).json({
        message: 'Cannot add Comment : ' + err
      });
    })
}

exports.getCommentsByPostID = (req, res, next) => {
  const postQuery = Comment.find({ postId: req.params.id });
  let transformedComment;
  postQuery
    .populate('userId', 'login')
    .populate('voteId', 'votes')
    .then((comment) => {
      transformedComment = transformComment.newComment(comment);
      return transformedComment;
    })
    .then(comment => {

      res.status(200).json({
        message: `Comment(s) with id:${req.params.id} fetched successfully !`,
        comment: comment
      });
    });
};
