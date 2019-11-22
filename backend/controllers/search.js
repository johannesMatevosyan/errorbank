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
  // Post.index({"$**" : "text"});
  //tags: [id1, id2]
  const query = {
    tags: {
      $in : req.body.tags
    }
  };

  Post.find(query, function(err, search) {

    if (err){
      return res.status(401).json({
        message: 'Wrong search input: ' + err,
      });
    }else{
      console.log(' *********** search  ***********', search);
      res.status(201).json({
        message: 'Search performed successfully!!!',
        search: search
      });
    }
  });

};


