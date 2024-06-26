/*
 *
 * Welcome to Wan File Archive
 * Author: Alexei Ionov
 * Date: 5/13/2024
 *
 */
const express = require('express');
const dotenv = require('dotenv');
const handleError = require('./middleware/errorHandler');
const router = require('./routes/index.js');
const session = require('express-session');
const { sessionStore } = require('./config/mongo');
const cors = require('cors');


dotenv.config();

/* loading in env variables */
const PORT = process.env.PORT;

console.log("booting express...");
/* start up our express application */
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true,              // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// app.use(cors()); for all origins


/* middleware to parse JSON requests */
app.use(express.json());
/* middleware for parsing HTML form submissions */
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.MONGO_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    maxAge: 3 * 1000 * 60 * 60 * 24, //persistent cookie for 3 days
  }
}));
/* route all paths to app/routes/index.js file */
app.use("/", router);
app.use(handleError);

app.listen(PORT, () => {
  console.log("server running on port 8000");
});
