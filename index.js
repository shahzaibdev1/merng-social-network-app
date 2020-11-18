// Dependencies
const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

// Local files
const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const port = process.env.PORT || 5000;

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return server.listen({ port });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
