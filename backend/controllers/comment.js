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
