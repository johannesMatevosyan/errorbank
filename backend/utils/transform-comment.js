module.exports = {
  newComment: (comments) => {

    let transformedComments = [];

    for (let i = 0; i < comments.length; i++) {
      let singleComment = comments[i].toObject();
      singleComment.userData = {
        userId : singleComment.userId._id,
        userName : singleComment.userId.login,
      };
      delete singleComment.userId;
      transformedComments.push(singleComment);
    }
    return transformedComments;
  },

};
