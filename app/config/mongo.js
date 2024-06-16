const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
require('dotenv').config();
console.log("connecting to mongoose");
//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("after connecting...");
// // Create session store 
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URI, // Specify the MongoDB connection URL
  collection: 'sessions',
  ttl: 14 * 24 * 60 * 60, // Optional: Session TTL (time-to-live) in seconds
  autoRemove: 'native', // Optional: Auto-remove expired sessions
});

// /* config for mongoDB to hold uploaded file metadata from users */
// const FileSchema = new mongoose.Schema({
//   filename: String, 
//   size: Number, 
//   rating: Number, 
//   owner: String, 
//   timestamp: { type: Date, default: Date.now },
//   s3key: String,
//   university: String, 
//   department: String, 
//   course_number: Number,
//   content_type: String,
// });

// const Files = mongoose.model('Files', FileSchema);

module.exports = {
  sessionStore,
  // Files,
};
