const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../utils/checkAuth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") throw new Error("Post must not be empty");

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });
      return post;
    },

    // Delete Post
    deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      return Post.findById(postId).then((post) => {
        if (user.username === post.username) {
          post.deleteOne({ id: postId });
          return "Post deleted";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      });
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST", {}),
    },
  },
};
