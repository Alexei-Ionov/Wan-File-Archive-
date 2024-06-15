const userModel = require("../models/userModel");
const argon2 = require('argon2');

exports.createAccount = async (username, email, password) => {
    try {
        const encryptedPassword = await argon2.hash(password, {
            hashLength: 64
        });
        console.log(encryptedPassword);
        console.log(encryptedPassword.length);
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
        const encryptedPassword = await argon2.hash(password, {
            hashLength: 64
        });
        const userInfo = await userModel.login(username, encryptedPassword);
        /* username and password doesn't match any existing users in out db */
        if (userInfo == undefined) {
            const err = new Error("Invalid credentials.");
            console.log(err.message);
            throw err;
        }
        return userInfo;
    } catch (err) {
        console.log(err.message);
        throw err;
    }
};
