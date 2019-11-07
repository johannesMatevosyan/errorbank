const mongoose = require('mongoose');

const tagsSchema = mongoose.Schema({
  name: String, required: false
});

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: false },
  date: { type: String, required: true },
  tags: [tagsSchema],
});

module.exports = mongoose.model('Post', postSchema);
