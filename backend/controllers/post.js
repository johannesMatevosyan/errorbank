const Post = require('../models/post');
const Tag = require('../models/tag');
const tranformPost = require('../utils/transform-post');

exports.createPost = (req, res, next) => {
  const parseTagsArray = JSON.parse(req.body.tagsArray);
  const url = req.protocol + '://' + req.get('host');
  const file = req.file.filename && (url + '/images/' + req.file.filename);
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

  console.log(' ***** req.body ***** ', req.body);

  const pageSize = +req.body.pagination.pagesize;
  const currentPage = +req.body.pagination.page;
  const tags = req.body.filter.tags;
  const filter = {};

  if (tags.length > 0) {
    filter.tags = {
      $in : req.body.filter.tags
    };
  }

  const postQuery = Post.find(filter)
    .populate('authorId', 'name')
    .populate('tags', 'label')
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);

  const countQuery = Post.count(filter);

  Promise.all([postQuery, countQuery])
    .then(([posts, total]) => {

      let mutated = tranformPost.newPost(posts);

      res.status(201).json({
        message: 'Posts are fetched successfully!!!',
        posts: mutated,
        maxPosts: total
      });

  })
  .catch(err => {
    res.status(500).json({
      message: 'Failed to filter submitted tag ' + err,
    });
  });

};

/*
exports.filterByTags = function(filter) {

  const postQuery = Post.find(filter)
    .populate('authorId', 'name')
    .populate('tags', 'label');

  postQuery.exec(filter, function(err, search) {

    if (err){
      return res.status(401).json({
        message: 'Wrong search input: ' + err,
      });
    }else{
      let transformedArray = [];

      for (var i = 0; i < search.length; i++) {
        let transformedPost = search[i].toObject();
        transformedPost.author = transformedPost.authorId;
        delete transformedPost.authorId;
        transformedArray.push(transformedPost);
      }

      res.status(201).json({
        message: 'Search performed successfully!!!',
        searchTags: transformedArray
      });
    }
  });
}
*/

exports.getPostById = (req, res, next) => {
  const postQuery = Post.findOne({ _id: req.params.id })
    .populate('authorId', 'name')
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
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  Post.findById({ _id: req.params.id })
    .then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.imagePath = imagePath;
        post.created = req.body.created;
        post.updated = req.body.updated;
        post.tags = JSON.parse(req.body.tagsArray);
        post.authorId = req.userData.githubId;
      return post.save();
    }).then(result => {
    res.status(200).json({
      message: `Post with id:${req.params.id} updated successfully! `,
      post: result
    });
  });

};

exports.deletePostById = (req, res, next) => {

  Post.deleteOne({ _id: req.params.id, authorId: req.userData.userId }).then(result => {

    if (result.n > 0) {
      res.status(200).json({
        message: `Post with id:${req.params.id} deleted successfully!`
      });
    } else {
      res.status(401).json({
        message: 'Not Authorized to delete!!'
      });
    }

  }).catch(error => {
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
