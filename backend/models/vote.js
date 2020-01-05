const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
  votes: [{
    type: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    date: { type: String, required: true }
  }],
  docId: { type: String, required: true },
  relatedTo: { type: String, required: true },
});

module.exports = mongoose.model('Vote', voteSchema);
