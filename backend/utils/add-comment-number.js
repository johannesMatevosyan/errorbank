module.exports = {
  addCommentCount: (postsArr, commentsArr) => {
    let transformedPosts = [];

    // postsArr = postsArr.map((element) => {
    //   return element.toObject();
    // });

    for (let i = 0; i < postsArr.length; i++) {
      let singlePost = postsArr[i];
      for (let j = 0; j < commentsArr.length; j++) {
        let singleComment = commentsArr[j];

        if (singlePost._id.toString() === singleComment._id.toString()) {
          singlePost.numOfComments = singleComment.numOfComments;
          transformedPosts.push(singlePost);
        }
      }
    }
    return transformedPosts;
  },

};
