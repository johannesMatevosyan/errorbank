const Comment = require('../models/comment');

exports.createComment = (req, res, next) => {

  const comment = new Comment({
    text: req.body.text,
    postId: req.body.postId,
    userId: req.body.userId,
    date: req.body.date,
  });

  comment.save()
    .then(createdComment => {
      res.status(201).json({
        message: 'Comment added successfully',
        comment: createdComment,
      });
    }).catch(err => {
    return res.status(401).json({
      message: 'Cannot add Comment : ' + err
    });
  });
};

exports.getCommentsByPostID = (req, res, next) => {
  console.log('getCommentsByPostID ', req.params.id);
  Comment.findOne({ postId: req.params.id }).then(comment => {
    console.log('comment ', comment);
    res.status(200).json({
      message: `Comment(s) with id:${req.params.id} fetched successfully!`,
      comment: comment
    });
  });
};
