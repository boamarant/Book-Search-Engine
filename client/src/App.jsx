import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;