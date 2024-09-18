import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Define the HTTP link
const httpLink = createHttpLink({
  uri: process.env.LIVE || 'http://localhost:3001/graphql', 
});

// Define the auth link to include JWT in headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/search" element={<SearchBooks />} />
          <Route path="/saved" element={<SavedBooks />} />
          <Route path="/" element={<SearchBooks />} /> {/* Default route */}
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;