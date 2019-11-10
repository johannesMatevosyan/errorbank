const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  console.log('req.userData ', req.userData);
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    created: req.body.created,
    updated: req.body.updated,
    tags: JSON.parse(req.body.tagsArray),
    author: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id,
      post: createdPost
    });
  });

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
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
  }).then(count => {
    res.status(200).json({ // retrieve all posts from db
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      maxPosts: count
    });
  });

};

exports.getPostById = (req, res, next) => {
  console.log('req.params.id : ', req.params.id);
  Post.findOne({ _id: req.params.id }).then(post => {
    console.log('req.params post : ', post);
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
    console.log('imagePath : ', imagePath);
  }
  Post.findById({ _id: req.params.id })
    .then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.imagePath = imagePath;
        post.created = req.body.created;
        post.updated = req.body.updated;
        post.tags = JSON.parse(req.body.tagsArray);
        post.author = req.userData.userId;
      return post.save();
    }).then(result => {
    res.status(200).json({
      message: `Post with id:${req.params.id} updated successfully! `,
      post: result
    });
  });

};

exports.deletePostById = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, author: req.userData.userId }).then(post => {
    res.status(200).json({
      message: `Post with id:${req.params.id} deleted successfully!`,
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
