const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: { type: String, required: true },
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
