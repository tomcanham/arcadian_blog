const express = require('express');
const allRoutes = require('./routes/all');
const uuidv4 = require('uuid/v4');
const cookieParser = require('cookie-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./blog/schema');

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
});

const app = express();
const port = 8000;

const APP_SECRET = process.env['APP_SECRET'] || uuidv4();
app.set('secret', APP_SECRET);

app.use(cookieParser(APP_SECRET));
app.use(express.json());

allRoutes(app);

// add Apollo GraphQL server
server.applyMiddleware({ app }); // app is from an existing express app

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));