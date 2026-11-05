import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import './index.css';

/**
 * Apollo Client configuration.
 * - Supports VITE_GRAPHQL_URI environment variable with local fallback.
 * - Normalized in-memory cache keyed by GraphQL entity `id`.
 */
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'https://book-library-backend-gacheruevans-projects.vercel.app',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
