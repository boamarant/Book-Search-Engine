require('dotenv').config();
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Use the PORT from .env

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: process.env.LIVE_2 || 'https://book-search-engine-b891.onrender.com' || 'http://localhost:3000', // Client's URL
  credentials: true,
};
app.use(cors(corsOptions));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  persistedQueries: false,
});

// Start Apollo Server and apply middleware to Express app
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Serve React app for any other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Initialize the server
startServer();