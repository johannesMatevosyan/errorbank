const Post = require('../models/post');
const Tag = require('../models/tag');
const Vote = require('../models/vote');
const Comment = require('../models/comment');
const tranformPost = require('../utils/transform-post');
const mergeCommentNumber = require('../utils/merge-comment-number');

exports.createPost = (req, res, next) => {
  const parseTagsArray = JSON.parse(req.body.tagsArray);
  const url = req.protocol + '://' + req.get('host');
  const file = req.file ? req.file.filename && (url + '/images/' + req.file.filename) : '';
  const saveTagsPromises = [];

  parseTagsArray.forEach(singleTag => { // Save tags to 'tags' table
    let query = {
      label: singleTag.label
    };
    saveTagsPromises.push(Tag.findOneAndUpdate(query, query, { upsert: true, new: true }));
  });
  Promise.all(saveTagsPromises)
    .then((tags) => {
      const tagIds = [];
      tags.forEach(tag => tag && tagIds.push(tag._id));
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: file,
        created: req.body.created,
        updated: req.body.updated,
        tags: tagIds,
        authorId: req.userData.userId
      });
      post.save()
        .then(createdPost => {
          res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id,
            post: createdPost,
          });
        }).catch(err => {
        return res.status(401).json({
          message: 'Cannot add post : ' + err
        });
      });
    })
    .catch(error => console.log(`Error in promises: ${error}`));
};

exports.getAllPosts = (req, res, next) => {

  const pageSize = +req.body.pagination.pagesize;
  const currentPage = +req.body.pagination.page;
  const tags = req.body.filter.tags;
  const text = req.body.text.word;
  const sortByDate = req.body.sortByDate;
  let filter = {};

  if (tags.length > 0) {
    filter.tags = {
      $in : req.body.filter.tags
    };
  }
  if (text !== '') {
    // filter.text = {$text: {$search: text}}
  }
  if (sortByDate !== '') {
    console.log('sortByDate : ', sortByDate);
  }

  const postQuery = Post.find(filter)
    .populate('authorId', 'name')
    .populate('tags', 'label')
    .populate('voteId', 'votes')
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);

  const countQuery = Post.count(filter);
  let maxPosts;
  let transformedPost;
  let postWithComments = [];

  Promise.all([postQuery, countQuery])
    .then(([posts, total]) => {
      maxPosts = total;
      transformedPost = tranformPost.newPost(posts);
      return transformedPost;
    })
    .then((postsArr) => {

      return Post.aggregate([
        {
          $lookup: {
            from: "comments", localField: "_id", foreignField: "docId", as: "postComments"
          }
        },
        {
          $project: {
            "numOfComments":{ $size: "$postComments" }
          }
        }
      ]).exec((err, commentsArr) => {

        postWithComments = mergeCommentNumber.addCommentCount(postsArr, commentsArr);

        res.status(201).json({
          message: 'Posts are fetched successfully!!!',
          posts: postWithComments,
          maxPosts: maxPosts
        });

      });

    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to filter submitted tag ' + err,
      });
    });

};

exports.getPostById = (req, res, next) => {
  const postQuery = Post.findOne({ _id: req.params.id })
    .populate('authorId', 'name')
    .populate('voteId', 'votes')
    .populate('tags', 'label');

  postQuery
    .then(post => {
      post.viewed++;
      return post.save();
    }).then((post) => {
      let transformPost = post.toObject();
      transformPost.author = transformPost.authorId;
      delete transformPost.authorId;

      res.status(200).json({
        message: `Post with id:${req.params.id} fetched successfully !`,
        post: transformPost
      });
    });

};


exports.updatePostById = (req, res, next) => {
  const parseTagsArray = JSON.parse(req.body.tagsArray);
  let imagePath = req.body.imagePath ? req.body.imagePath : '';
  const saveTagsPromises = [];
  const tagIds = [];

  parseTagsArray.forEach(singleTag => { // Save tags to 'tags' table
    let query = {
      label: singleTag.label
    };
    saveTagsPromises.push(Tag.findOneAndUpdate(query, query, { upsert: true, new: true }));
  });

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  Promise.all(saveTagsPromises)
    .then((tags) => {

      tags.forEach(tag => tag && tagIds.push(tag._id));
      return Post.findById({ _id: req.params.id });
    })
    .then((post) => {
      post.title = req.body.title;
      post.content = req.body.content;
      post.imagePath = imagePath;
      post.created = req.body.created;
      post.updated = req.body.updated;
      post.tags = tagIds;
      post.authorId = req.userData.userId;
      post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: `Post with id:${req.params.id} updated successfully! `,
        post: result
      });
    })
    .catch(error => console.log(`Error in promises: ${error}`));
};

exports.deletePostById = (req, res, next) => {

  Post.deleteOne({ _id: req.params.id, authorId: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        Comment.deleteMany({ postId: req.params.id }).exec();

        res.status(200).json({
          message: `Post with id:${req.params.id} deleted successfully!`
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized to delete!!'
        });
      } 
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to delete: " + error,
      });
    });
};

exports.getPostsByDate = (req, res, next) => {
  Post.find({}, {title : 1 }).sort({date: -1}).limit(5).then(post => {
    res.status(200).json({ // retrieve all posts from db by date
      message: 'Posts got by date successfully!',
      posts: post
    });
  });
};

exports.voteForPost = (req, res, next) => {
  const query = {
    docId: req.body.docId,
    relatedTo: req.body.relatedTo
  };
  const voteObj = {
    type: req.body.type,
    userId: req.body.userId,
    relatedTo: req.body.relatedTo,
    date: req.body.date
  };
  let model;

  Vote.findOneAndUpdate(query, query, { upsert: true, new: true })
    .then((vote) => {
      const index = vote.votes.findIndex((v) => {
        return v.userId == voteObj.userId;
      });

      if (index > -1) {
        if (vote.votes[index].type !== voteObj.type) {
          vote.votes[index] = voteObj;
        } else {
          vote.votes.splice(index, 1);
        }
      } else {
        vote.votes.push(voteObj);
      }
      model = voteObj.relatedTo === 'post' && Post || Comment;
      return Promise.all([
        vote.save(),
        model.update(
          { _id: req.body.docId },
          { $set: { voteId: vote._id }}
        )
      ]);
    })
    .then(([Votes, post]) => {

      return model.findOne({_id: req.body.docId })
        .populate('voteId', 'votes');

    }).then(post => {
      res.status(201).json({
        message: 'Vote added successfully!',
        post: post
      });
    })
    .catch((err)=> {
      return res.status(401).json({
        message: 'Cannot save vote. ' + err,
      });
    });

};
