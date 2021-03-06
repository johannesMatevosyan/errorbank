const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // checks data before it is saved to database

const tagSchema = mongoose.Schema({
  label: { type: String, required: true, unique: true },
});

tagSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Tag', tagSchema);
