const Comment = require('../models/comment');
const UserInfo = require('../models/user-info');
const transformComment = require('../utils/transform-comment');

exports.createComment = (req, res, next) => {
  let userId = req.body.userId;
  const comment = new Comment({
    text: req.body.text,
    postId: req.body.postId,
    userId: userId,
    date: req.body.date,
  });
  comment.save()
    .then(createdComment => {
      return UserInfo.findOne({ _id: userId }).then(user => {
          if (user){
            let updatedComment = createdComment.toObject();
            updatedComment.userData = {
              userId: user._id,
              userName: user.login
            };
            return updatedComment;
          }
        })
    })
    .then(comment => {
      res.status(201).json({
        message: 'Comment added successfully',
        comment: comment,
      });
    }).catch(err => {
    return res.status(401).json({
      message: 'Cannot add Comment : ' + err
    });
  });
};

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
