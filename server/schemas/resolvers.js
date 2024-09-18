const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Example implementation for a searchBooks query
const searchBooks = async (parent, { query }) => {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
  const data = await response.json();
  return data.items.map(item => ({
    bookId: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || [],
    description: item.volumeInfo.description,
    image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
    link: item.volumeInfo.infoLink,
  }));
};

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Not logged in');
    },
    searchBooks, // Add searchBooks resolver here
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
          console.log('Received bookData:', bookData);
      
          // Check if bookData structure is as expected
          const { bookId, title, authors, description, image, link } = bookData;
          if (!bookId || !title || !Array.isArray(authors)) {
            throw new Error('Invalid bookData');
          }
      
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookData } },
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('Not logged in');
      },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;