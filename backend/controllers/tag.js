const Tag = require('../models/tag');

exports.getAllTags = (req, res, next) => {
  Tag.find().then(tags => {
      res.status(200).json({ // retrieve all posts from db
        message: 'Tags are fetched successfully!',
        tagsArray: tags
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Cannot find tag info' + err
      });
    });
};
