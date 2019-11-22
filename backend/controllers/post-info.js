const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPostCommentInfoById = (req, res, next) => {
  const postQuery = Comment.findOne({ postId: req.params.id });

  postQuery
    .find().then(posts => {

      let numberOfComments = posts.length;

    res.status(200).json({
      message: `Comment(s) based on post with id:${req.params.id} fetched successfully !`,
      commentsNumber: numberOfComments
    });
  });

};

exports.voteForPostById = (req, res, next) => {

  let userId = req.userData.userId;
  let vote = req.body.vote;

  const postQuery = Post.findOne({ _id: req.body.postId });

  postQuery
    .find().then(post => {
    //post.votes = ;
    return post.save();
  }).then((result) => {
console.log('result ', result);
    res.status(200).json({
      message: `Vote saved successfully !`,
    });
  });

};

