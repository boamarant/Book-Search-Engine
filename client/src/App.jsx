import React from 'react';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function MyApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default MyApp;