const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: { type: String, required: true },
  postId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
