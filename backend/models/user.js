const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  login: { type: String, required: true },
});

module.exports = mongoose.model('Users', userSchema);
