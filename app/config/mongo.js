const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create session store
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URI, // Specify the MongoDB connection URL
  collection: 'sessions',
  ttl: 14 * 24 * 60 * 60, // Optional: Session TTL (time-to-live) in seconds
  autoRemove: 'native', // Optional: Auto-remove expired sessions
});

module.exports = {
  sessionStore,
};
