const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: false },
  created: { type: String, required: true },
  updated: { type: String, required: false },
  tags: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: false} ],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
  viewed: { type: Number, required: false, default: 0 },
  voteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: false },
});

postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
