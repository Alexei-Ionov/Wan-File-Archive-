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

exports.login = async (email, password) =>  {
    try { 
        const userData = await userModel.getUser(email);
        /* user doesn't exist in db */
        if (userData == undefined) {
            throw new Error("No user exists for this email");
        }
        const { id, encryptedpassword, username } = userData;
        const passwordMatch = await argon2.verify(encryptedpassword, password);
        if (!passwordMatch) {
            throw new Error("Invalid credentials");
        }
        return {id, username};
    } catch (err) {
        throw err;
    }
};

exports.logout = async (sessionID) => { 
    try { 
        await userModel.logout(sessionID);
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