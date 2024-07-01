const userService = require("../services/userService");
const fileController = require('./fileController');
/* <------------ POST REQUESTS ----------->  */
exports.createUser = async (req, res, next) => {
  const { username, email, password1, password2 } = req.body;
  if (!username || !email || !password1 || !password2) {
    return res.status(401).send("Need a valid username, email, and password to create acc");
  }

  if (password1 !== password2) { 
    return res.status(401).send("Passwords don't match!");
  }
  try {
    await userService.createAccount(username, email, password1);
    return res.status(201).send("Account Created Successfully!");
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) =>  { 
  const { email, password } = req.body;
  try { 
    if (!email) {
      throw new Error("Invalid email");
    }
    if (!password) { 
      throw new Error("Invalid password");
    }
    const { id, username } = await userService.login(email, password);
    /* set up session-related things */
    console.log("logged in user - backend");
    req.session.userID = id;
    req.session.username = username;
    req.session.email = email;
    res.status(201).json({"username": username, "email": email, "userID": id});
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (!req.sessionID) {
      throw new Error("Session ID not found");
    }

    // Use req.session.destroy to properly handle session destruction
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // Send response after session is destroyed
      res.status(200).send("Logout Successful!");
    });
  } catch (err) {
    next(err);
  }
};


/* <------------ GET REQUESTS ----------->  */

exports.viewProfile = async (req, res, next) => {    
  const { ownerid } = req.query;
  try { 
    const userData = await userService.viewProfile(ownerid);
    return res.status(201).json(userData);
  } catch (err) { 
    next(err);
  }
};

exports.viewProfileContent = async (req, res, next) => {    
  const { ownerid, files_loaded} = req.query;
  const userID = req.session.userID;
  try { 
    const files = await fileController.loadFilesMetadataByOwner(ownerid, userID, files_loaded);
    return res.status(201).json(files);
  } catch (err) { 
    next(err);
  }
};

/* ADMIN */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};

