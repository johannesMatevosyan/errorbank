const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Search', searchSchema);
