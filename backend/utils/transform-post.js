module.exports = {
  newPost: (posts) => {

    let transformedPosts = [];

    for (let i = 0; i < posts.length; i++) {
      let singlePost = posts[i].toObject();
      singlePost.voteObj = singlePost.voteId ? singlePost.voteId : {};
      singlePost.author = singlePost.authorId;
      delete singlePost.voteId;
      delete singlePost.authorId;
      transformedPosts.push(singlePost);
    }
    return transformedPosts;
  },

};
