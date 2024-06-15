/*
 *
 * Welcome to Wan File Archive
 * Author: Alexei Ionov
 * Date: 5/13/2024
 *
 */
const express = require("express");
const dotenv = require("dotenv");
const handleError = require("./app/middleware/errorHandler.js");
const router = require("./app/routes/index.js");

dotenv.config();

/* loading in env variables */
const PORT = process.env.PORT;

console.log("booting express...");
/* start up our express application */
const app = express();

/* middleware to parse JSON requests */
app.use(express.json());

console.log("handling routes...");
/* route all paths to app/routes/index.js file */
app.use("/", router);
app.use(handleError);

app.listen(PORT, () => {
  console.log("server running on port 8080");
});
