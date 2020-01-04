const Notification = require('../models/notification');

exports.getNotifications = (req, res) => {
    Notification
        .find({ userId: req.userData.userId })
        .populate('commentId', 'text')
        .populate('postId', 'title')
        .then(notifications => {
            res.status(201).json({
                message: 'Notifications are fetched successfully',
                notifications
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Failed to filter submitted tag ' + err,
            });
        });
};

exports.markRead = (req, res) => {
    Notification.update({ _id: req.params.id }, { $set: { read: true } }).then(() => res.end());
}
