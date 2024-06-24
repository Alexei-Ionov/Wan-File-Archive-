const userModel = require("../models/userModel");
const argon2 = require('argon2');

exports.createAccount = async (username, email, password) => {
    try {
        const encryptedPassword = await argon2.hash(password, {
            hashLength: 64
        });
        const newUser = await userModel.createUser(username, email, encryptedPassword);
        return newUser;
    } catch (err) {
        console.log("error hashing password...");
        throw err;
    }
};

exports.getUsers = async () => {
  try {
    const users = await userModel.getAllUsers();
    return users;
  } catch (err) {
    throw err;
  }
};

exports.login = async (username, password) =>  {
    try { 
        const userData = await userModel.getUser(username);
        /* user doesn't exist in db */
        if (userData == undefined) {
            const err = new Error("No user exists for this username.");
            throw err;
        }
        const { id, encryptedpassword } = userData;
        const passwordMatch = await argon2.verify(encryptedpassword, password);
        if (!passwordMatch) {
            const err = new Error("Invalid credentials.");
            throw err;
        }
        return id;
    } catch (err) {
        throw err;
    }
};

exports.viewProfile = async (userID) => { 
    try { 
        const userData = await userModel.getProfile(userID);
        return userData;
    } catch (err) { 
        throw err;
    }
};