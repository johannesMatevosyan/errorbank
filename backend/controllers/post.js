const Post = require('../models/post');
const Tag = require('../models/tag');
const PostVote = require('../models/post-vote');
const tranformPost = require('../utils/transform-post');

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
  console.log('req.body ', req.body);
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
    console.log('sortByDate ', sortByDate);
  }

  console.log('filter  : ', filter);

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
console.log(' >>>>>>> populate >>>>>>>  ', post);
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


exports.voteForPost = (req, res, next) => {
  const query = { postId: req.body.postId };
  const vote = {
    type: req.body.type, date: req.body.date, userId: req.body.userId
  };

  PostVote.findOneAndUpdate(query, query, { upsert: true })
    .then((postVote) => {
      console.log('postVote ', postVote);
      const index = postVote.votes.findIndex((vote) => {
        return vote.userId === req.body.userId;
      });
      if (~index) {
        postVote.votes.splice(index, 1);
      } else {
        postVote.votes.push(vote);
      }
      return Promise.all([postVote.save(), Post.update({ _id: req.body.postId }, { $set: { voteId: postVote._id } })]);
    }).then(() => {
      res.status(201).json({
        message: 'Vote added successfully! ',
      });
    })
    .catch((err)=> {
      console.log('Error: ' + err);
      return res.status(401).json({
        message: 'Cannot save vote',
      });
    });

};
