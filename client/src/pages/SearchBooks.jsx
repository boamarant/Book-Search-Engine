import React, { useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { SAVE_BOOK } from '@graphql/mutations';
import { SEARCH_BOOKS_QUERY, GET_ME } from '@graphql/queries';
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
    if (!bookToSave) {
      console.error('Book not found');
      return;
    }
  
    const bookData = {
      bookId: bookToSave.bookId,
      title: bookToSave.title,
      authors: Array.isArray(bookToSave.authors) ? bookToSave.authors : [],
      description: bookToSave.description || '',
      image: bookToSave.image || '',
      link: bookToSave.link || '',
    };
  
    try {
      await saveBook({
        variables: { bookData },
        refetchQueries: [{ query: GET_ME }],
      });
      console.log('Book saved successfully');
    } catch (err) {
      console.error('Error saving book:', err.message);
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

      <div className="book-grid">
        {searchedBooks.length > 0 ? (
          searchedBooks.map((book) => (
            <div className="book-card" key={book.bookId}>
              {book.image && <img src={book.image} alt={book.title} className="book-image" />}
              <h3>{book.title}</h3>
              <p>{book.authors.join(', ')}</p>
              {book.description && <p>{book.description}</p>}
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