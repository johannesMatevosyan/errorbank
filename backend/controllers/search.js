const Post = require('../models/post');

exports.searchKey = (req, res, next) => {

  Post.ensureIndexes({"$**" : "text"});
  Post.find({$text: { $search: req.body.key }}, function(err, search) {

    if (err){
      return res.status(401).json({
        message: 'Wrong search input'
      });
    }else{
      res.status(201).json({
        message: 'Search performed successfully!!',
        search: search
      });
    }
  });

};

exports.searchByTag = (req, res, next) => {
console.log('req.body ', req.body);
  const query = {
    tags: {
      $in : req.body.tags
    }
  };
  const postQuery = Post.find(query)
    .populate('authorId', 'name')
    .populate('tags', 'label');

  postQuery.exec(query, function(err, search) {

    if (err){
      return res.status(401).json({
        message: 'Wrong search input: ' + err,
      });
    }else{
      console.log(' ++ *********** search  *********** ++++ ', search);
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

};


