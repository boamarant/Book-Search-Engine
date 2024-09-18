import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '@graphql/queries';
import { REMOVE_BOOK } from '@graphql/mutations';
import Auth from '../utils/auth';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
        update: (cache, { data: { removeBook } }) => {
          const { me } = cache.readQuery({ query: GET_ME });
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: removeBook.savedBooks } },
          });
        },
      });
      console.log('Book removed successfully');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{Auth.loggedIn() ? `${userData.username}'s saved books` : 'Log in to see saved books'}</h2>
      <div>
        {userData.savedBooks?.map((book) => (
          <div key={book.bookId}>
            <h3>{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
            <button onClick={() => handleDeleteBook(book.bookId)}>Remove This Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBooks;