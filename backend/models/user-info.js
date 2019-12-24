const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  githubId: { type: String, required: true },
  name: { type: String, required: true },
  login: { type: String, required: true },
  location: { type: String, required: false },
  bio: { type: String, required: false },
  date: { type: String, required: false },
});

module.exports = mongoose.model('UserInfo', userSchema);
