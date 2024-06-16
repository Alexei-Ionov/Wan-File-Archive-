/*
 *
 * Welcome to Wan File Archive
 * Author: Alexei Ionov
 * Date: 5/13/2024
 *
 */
const express = require("express");
const dotenv = require("dotenv");
const handleError = require("./app/middleware/errorHandler");
const router = require("./app/routes/index.js");
const session = require('express-session');
const { sessionStore } = require('./app/config/mongo');


dotenv.config();

/* loading in env variables */
const PORT = process.env.PORT;

console.log("booting express...");
/* start up our express application */
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Specify the views directory (optional, defaults to './views')
app.set('views', './app/views');

/* middleware to parse JSON requests */
app.use(express.json());
/* middleware for parsing HTML form submissions */
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.MONGO_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));
/* route all paths to app/routes/index.js file */
app.use("/", router);
app.use(handleError);

app.listen(PORT, () => {
  console.log("server running on port 8000");
});
