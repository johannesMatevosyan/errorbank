module.exports = {
  newPost: (posts) => {
    let transformedPosts = [];

    for (let i = 0; i < posts.length; i++) {
      let singlePost = posts[i].toObject();
      singlePost.author = singlePost.authorId;
      delete singlePost.authorId;
      transformedPosts.push(singlePost);
    }
    return transformedPosts;
  },

};
