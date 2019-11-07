const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  tags: { type: Array, required: false },
});

module.exports = mongoose.model('Post', postSchema);
