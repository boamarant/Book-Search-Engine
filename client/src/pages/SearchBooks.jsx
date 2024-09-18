import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_BOOK } from '@graphql/mutations';
import { SEARCH_BOOKS_QUERY } from '@graphql/queries';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [saveBook] = useMutation(SAVE_BOOK);

  // Execute query when searchInput changes and is not empty
  const { data, loading, error } = useQuery(SEARCH_BOOKS_QUERY, {
    variables: { query: searchInput },
    skip: !searchInput, // Skip query if searchInput is empty
  });

  // Update searchedBooks when data changes
  React.useEffect(() => {
    if (data && data.searchBooks) {
      setSearchedBooks(data.searchBooks); // Update with search results
    }
  }, [data]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // No need to handle setting searchedBooks here anymore, as it's managed by useEffect
    setSearchInput(''); // Clear input after search
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
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
        {searchedBooks.length === 0 && <p>No books found</p>}
        {searchedBooks.map((book) => (
          <div key={book.bookId}>
            <h3>{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
            {Auth.loggedIn() && (
              <button onClick={() => handleSaveBook(book.bookId)}>
                Save This Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;