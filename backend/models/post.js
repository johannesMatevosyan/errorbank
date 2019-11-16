const mongoose = require('mongoose');

const tagsSchema = mongoose.Schema({
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
  required: false
});

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: false },
  created: { type: String, required: true },
  updated: { type: String, required: false },
  tagIdArray: [ tagsSchema ],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Post', postSchema);
