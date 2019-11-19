const Post = require('../models/post');
const Tag = require('../models/tag');

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
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .populate('authorId', 'name')
    .populate('tags.label')
    .then(documents => {
      console.log('documents ', documents);
      fetchedPosts = documents;
      return Post.count();
  }).then(count => {
    res.status(200).json({ // retrieve all posts from db
      message: 'Posts fetched successfully! ',
      posts: fetchedPosts,
      maxPosts: count
    });
  });

};

exports.getPostById = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    res.status(200).json({
      message: `Post with id:${req.params.id} fetched successfully!`,
      post: post
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
        post.authorId = req.userData.userId;
      return post.save();
    }).then(result => {
    res.status(200).json({
      message: `Post with id:${req.params.id} updated successfully! `,
      post: result
    });
  });

};

exports.deletePostById = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, authorId: req.userData.userId }).then(post => {
    res.status(200).json({
      message: `Post with id:${req.params.id} deleted successfully! `,
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
