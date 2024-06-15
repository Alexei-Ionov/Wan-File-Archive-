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

/* current implementation has it so that we don't return anything up to the controller. */ 
exports.login = async (username, password) =>  {
    try { 
        const { encryptedpassword } = await userModel.getUser(username);
        const userObject = await userModel.getUser(username);
        console.log(userObject);
        const passwordMatch = await argon2.verify(encryptedpassword, password);
        if (!passwordMatch) {
            const err = new Error("Invalid credentials.");
            throw err;
        }
    } catch (err) {
        throw err;
    }
};
