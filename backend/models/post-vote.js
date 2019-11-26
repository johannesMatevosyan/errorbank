const mongoose = require('mongoose');

const postVoteSchema = mongoose.Schema({
  votes: [{
    type: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }
  }],
  postId: { type: String, required: true },
});

module.exports = mongoose.model('PostVote', postVoteSchema);
