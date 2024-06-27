const userService = require("../services/userService");
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
  
    req.session.userID = id;
    req.session.username = username;
    req.session.email = email;
    res.status(201).json({"username": username, "email": email});
  } catch (err) {
    next(err);
  }
};

exports.logout = async(req, res, next) => {
  
  try { 
    if (!req.sessionID) { 
      throw new Error("Session ID not found");
    }
    await userService.logout(req.sessionID);
  } catch (err) { 
    next(err);
  }
};

/* <------------ GET REQUESTS ----------->  */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
exports.viewProfile = async (req, res, next) => {    
  try { 
    const userID = req.session.userID;
    const userData = await userService.viewProfile(userID);
    res.status(201).json(userData);
  } catch (err) { 
    next(err);
  }
  
};

