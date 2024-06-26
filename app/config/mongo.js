const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
require('dotenv').config();
console.log("connecting to mongoose");
//Connect to MongoDB
async function startConnection() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
startConnection();
// // Create session store 
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL, // Specify the MongoDB connection URL
  collection: 'sessions',
  ttl: 14 * 24 * 60 * 60, // Optional: Session TTL (time-to-live) in seconds
  autoRemove: 'native', // Optional: Auto-remove expired sessions
});

// /* config for mongoDB to hold uploaded file metadata from users */
const fileSchema = new mongoose.Schema({
  filename: String, 
  fileid: String, 
  size: Number, 
  rating: Number, 
  owner: String,
  ownerid: Number, 
  timestamp: { type: Date, default: Date.now },
  s3key: String,
  university: String, 
  department: String, 
  course_number: Number,
  content_type: String,
  votes: { 
    upvotes: [Number], //list of user ids that upvoted the file
    downvotes: [Number],
  }
});

const Files = mongoose.model('Files', fileSchema);


const deleteAllDocs = async () => { 
  try { 
    Files.deleteMany({});
    console.log("successfully dropped prev files collection");
  } catch (err) { 
    console.log("error deleting docs");
    throw err;
  }
}

// Close the connection when the application is shutting down
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
module.exports = {
  sessionStore,
  Files,
};