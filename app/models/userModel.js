const db = require("../config/postgres");
const { sessionStore } = require('../config/mongo');

/* admin helper function */
exports.getAllUsers = async () => {
  const res = await db.query("SELECT * FROM users", []);
  return res.rows;
};

/* called when a user tries to create an account */
exports.getUser = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1", [username,]);
  return res.rows[0]; //returns undefined if user doesn't exist in our db
};

/* called when a user creates an account */
exports.createUser = async (username, email, encryptedPassword) => {
  const client = await db.connect();
  await client.query("BEGIN");
  try {
    const result = await this.getUser(username);
    if (result != undefined) {
      throw new Error("Username is already taken");
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

exports.updateUserRating = async (userID, upvote) => {
  let query;
  if (upvote === "1") {
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

exports.logout = async (sessionID) => { 
  try { 
    await sessionStore.destroy(sessionID, (err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        console.log('Session destroyed successfully');
      }
    });
  } catch (err) { 
    throw err;
  }
};
/* CURRENTLY UNUSED */
exports.login = async (username, encryptedPassword) => {
  const query = "SELECT * FROM users WHERE username = $1 AND encryptedPassword = $2";
  try {
    const res = await db.query(query, [username, encryptedPassword]);
    console.log(res.rows);
    return res.rows[0];
  } catch (err) {
    throw err;
  }
};
