const db = require("../config/postgres");

/* admin helper function */
exports.getAllUsers = async () => {
  const res = await db.query("SELECT * FROM users", []);
  return res.rows;
};

/* called when a user tries to create an account */
exports.checkIfUsernameExists = async (username) => {
  const res = await db.query("SELECT * FROM users WHERE username = $1", [username,]);
  return res.rows[0]; //returns undefined if user doesn't exist in our db
};

/* called when a user creates an account */
exports.createUser = async (username, email, encryptedPassword) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await this.checkIfUsernameExists(username);
    if (result != undefined) {
      const err = new Error("user with username alr exists");
      err.name = "ValidationError";
      throw err;
    }
    const query =
      "INSERT INTO users (username, password, email, rating) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [username, encryptedPassword, email, 0];
    const newUser = await db.query(query, values);
    await client.query("COMMIT");
    return newUser;
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err.message);
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

exports.updateUserRating = async (username, upvote) => {
  let query;
  if (upvote) {
    query = "UPDATE users SET rating = rating + 1 WHERE username = $1";
  } else {
    query = "UPDATE users SET rating = rating - 1 WHERE username = $1";
  }
  try {
    const res = await db.query(query, [username]);
    return res.rowCount;
  } catch (err) {
    console.log("error updating user rating...", err.message);
    throw err;
  }
};

exports.login = async (username, password) => {
  const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
  try {
    const res = await db.query(query, [username, password]);
    return res.rows[0];
  } catch (err) {
    throw err;
  }
};
