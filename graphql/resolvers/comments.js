const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../utils/checkAuth");

module.exports = {
  Mutation: {
    createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);

      // Validate comment
      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      // Find post by ID
      return Post.findById(postId)
        .then((post) => {
          if (post) {
            post.comments.unshift({
              body,
              username: username,
              createdAt: new Date().toISOString(),
            });

            post.save();
            return post;
          } else throw new UserInputError("Post not found");
        })
        .catch((err) => {
          throw new Error(err);
        });
    },

    deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      return Post.findById(postId).then((post) => {
        if (post) {
          // Get remove index
          const commentIndex = post.comments
            .map((item) => item.id)
            .indexOf(commentId);

          // If comment exists
          if (commentIndex >= 0) {
            console.log(commentIndex);

            // Check if user user who commented is same as authenticated
            if (post.comments[commentIndex].username === username) {
              // Remove the comment
              post.comments.splice(commentIndex, 1);

              return post.save().then((post) => post);
            }
          } else throw new UserInputError("Comment not found");
        }
      });
    },

    likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      return Post.findById(postId)
        .then((post) => {
          if (post) {
            if (post.likes.find((like) => like.username === username)) {
              // Post is already liked, So Unliking it
              post.likes = post.likes.filter(
                (like) => like.username !== username
              );
              return post.save();
            } else {
              // Like the post
              post.likes.push({
                username,
                createdAt: new Date().toISOString(),
              });
            }
            return post.save().then((post) => post);
          } else throw new Error("Post not found");
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
  },
};
