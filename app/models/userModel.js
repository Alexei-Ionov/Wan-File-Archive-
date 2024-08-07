const db = require("../config/postgres");
const { sessionStore } = require('../config/mongo');

/* admin helper function */
exports.getAllUsers = async () => {
  const res = await db.query("SELECT * FROM users", []);
  return res.rows;
};

/* called when a user tries to create an account */
exports.checkIfUsernameExists = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1", [username,]);
  return res.rows[0]; //returns undefined if username doesn't exist in our db
};

exports.checkIfEmailExists = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email,]);
  return res.rows[0]; //returns undefined if email doesn't exist in our db
};


/* called when a user tries to login into their account */
exports.getUser = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email,]);
  return res.rows[0]; //returns undefined if username doesn't exist in our db
};



/* called when a user creates an account */
exports.createUser = async (username, email, encryptedPassword) => {
  const client = await db.connect();
  await client.query("BEGIN");
  try {
    const usernameCheck = await this.checkIfUsernameExists(username);
    if (usernameCheck != undefined) {
      throw new Error("Username is already taken!");
    }
    const emailCheck = await this.checkIfEmailExists(email);
    if (emailCheck != undefined) { 
      throw new Error("Email already has an account");
    }
    const query =
      "INSERT INTO users (username, encryptedpassword, email, rating) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [username, encryptedPassword, email, 0];
    const newUser = await db.query(query, values);
    await client.query("COMMIT");
    return newUser;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.deleteUser = async (username) => {
  const query = "DELETE FROM users WHERE username = $1";
  try {
    const result = await db.query(query, [username]);
    return result.rowCount;
  } catch (err) {
    console.log("error deleting user:", err.message);
    throw err;
  }
};

exports.updateUserRating = async (userID, vote) => {
  let query;
  if (vote === "1") {
    query = "UPDATE users SET rating = rating + 1 WHERE id = $1";
  } else {
    query = "UPDATE users SET rating = rating - 1 WHERE id = $1";
  }
  try {
    const res = await db.query(query, [userID]);
    return res.rowCount;
  } catch (err) {
    console.log("error updating user rating...", err.message);
    throw err;
  }
};


exports.getProfile = async (userID) => { 
  try { 
    const query = `SELECT * FROM users WHERE id = $1`;
    const res = await db.query(query, [userID]);
    return res.rows[0];
  } catch (err) { 
    console.log(err.message);
    throw err;
  }
}

exports.getLeaderboard = async () => { 
  try { 
    const query =  'SELECT id, username, rating FROM users ORDER BY rating DESC LIMIT 10';
    const res = await db.query(query, []);
    return res.rows;
  } catch (err) {
    throw err;
  }
};
