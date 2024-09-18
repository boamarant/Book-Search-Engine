const mongoose = require('mongoose');

const localUri = 'mongodb://127.0.0.1:27017/book-search-engine';
const remoteUri = process.env.MONGODB_URI;

const dbUri = process.env.NODE_ENV === 'production' ? remoteUri : localUri;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
});

module.exports = mongoose.connection;