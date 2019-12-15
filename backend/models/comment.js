const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: false },
});

module.exports = mongoose.model('Comment', commentSchema);
