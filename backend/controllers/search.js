const SearchPost = require('../models/post');

exports.searchKey = (req, res, next) => {

  SearchPost.ensureIndexes({"$**" : "text"});
  SearchPost.find({$text: { $search: req.body.key }}, function(err, search) {

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
