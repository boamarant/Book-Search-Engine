import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_BOOK } from '@graphql/mutations';
import { SEARCH_BOOKS_QUERY } from '@graphql/queries';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchBooks, { data, loading, error }] = useLazyQuery(SEARCH_BOOKS_QUERY);
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (searchInput) {
      searchBooks({ variables: { query: searchInput } });
    }
  };

  React.useEffect(() => {
    if (data && data.searchBooks) {
      setSearchedBooks(data.searchBooks); // Update with search results
    }
  }, [data]);

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log('Book to save:', bookToSave); 
    try {
      await saveBook({
        variables: { bookData: { ...bookToSave } },
      });
      console.log('Book saved successfully');
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Search error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search for a book"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchedBooks.length > 0 ? (
          searchedBooks.map((book) => (
            <div key={book.bookId}>
              {book.image && <img src={book.image} alt={book.title} style={{ width: '100px', height: '150px' }} />}
              <h3>{book.title}</h3>
              <p>{book.authors.join(', ')}</p>
              {Auth.loggedIn() && (
                <button onClick={() => handleSaveBook(book.bookId)}>
                  Save This Book
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchBooks;