const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
