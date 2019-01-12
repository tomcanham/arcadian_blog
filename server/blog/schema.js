const { gql } = require('apollo-server');
const { users, posts } = require('./mock');

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type User {
    title: String
    author: String
  }

  type Post {

  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    users: [User],
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    users: () => users
  },
};

module.exports = { typeDefs, resolvers };