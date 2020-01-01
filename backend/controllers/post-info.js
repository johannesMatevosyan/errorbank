const Comment = require('../models/comment');

exports.getPostCommentInfoById = (req, res, next) => {
  const postQuery = Comment.findOne({ postId: req.params.id });

  postQuery
    .find()
    .then(posts => {
      let numberOfComments = posts.length;

      res.status(200).json({
        message: `Comment(s) based on post with id:${req.params.id} fetched successfully !`,
        commentsNumber: numberOfComments
      });
    });
};
