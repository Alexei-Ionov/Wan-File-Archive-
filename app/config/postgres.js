/* config file for postgres */
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); //load environment variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function dropPrevUserTable() { 
  /* dropping previous user table */
  console.log("dropping previous user table if it exists...");
  const dropTableQuery = 'DROP TABLE IF EXISTS users;';
  try { 
    await pool.query(dropTableQuery);
    console.log("prev user table dropped successfully");
  } catch (err) {
    console.log("failed to drop prev user table");
    throw err;
  }
}


async function createNewUserTable() {
  console.log("creating new user table");
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, 
        username VARCHAR(30) UNIQUE NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        encryptedPassword VARCHAR(256) NOT NULL, 
        rating INTEGER NOT NULL
    );
  `;
  try { 
    await pool.query(createUserTableQuery);
    console.log("user table created successfully");
  } catch (err) {
    console.log("failed to create new user table");
    throw err;
  }
}

async function main() { 
  await dropPrevUserTable();
  await createNewUserTable();
}
main();

//export our query method to allow other files w/in our project to query our db!
module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(), // Define a connect function to get a client from the pool
};
