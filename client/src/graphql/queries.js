import { gql } from '@apollo/client';

// Query to get the currently logged-in user's data
export const GET_ME = gql`
  query getMe {
    me {
      username
      savedBooks {
        bookId
        title
        authors
      }
    }
  }
`;

// Query to search for books
export const SEARCH_BOOKS_QUERY = gql`
  query searchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;