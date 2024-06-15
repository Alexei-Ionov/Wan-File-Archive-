const userService = require("../services/userService");
const { v4: uuidv4 } = require('uuid');

function setUserID(req) { 
  // Generate a v4 (random) UUID
  const uuid = uuidv4();
  req.session.userID = uuid;
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(201).json(users);
  } catch (err) {
    throw err;
  }
};

exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(401)
      .send("Need a valid username, email, and password to create acc");
  }
  try {
    const newUser = await userService.createAccount(username, email, password);
    setUserID(req);
    res.status(201).json(newUser);
  } catch (err) {
    /* pass error onto global error handler */
    next(err);
  }
};


exports.loginUser = async (req, res, next) =>  { 
  const { username, password } = req.body;
  /* invalid username & password */
  if (!username || !password) {
    console.log("error happens inside controller??");
    const err = new Error("Invalid username or password.");
    throw err;
  }
  try { 
    await userService.login(username, password);
    setUserID(req);
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

exports.viewProfile = async (req, res, next) => {     
  res.status(201).send("profile viewed successfully !");
}

exports.loginPage = async (req, res, next) => {     
  res.status(201).send('<h1> Log in below </h1>');
}

exports.homePage = async(req, res, next) => { 
  res.status(201).send('<h1> Home Page </h1>');
}

