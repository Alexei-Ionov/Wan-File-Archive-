const userService = require("../services/userService");

function setSessionUserID(req, userID) { 
  req.session.userID = userID;
}
function setSessionUsername(req, username) { 
  req.session.username = username;
}
/* <------------ POST REQUESTS ----------->  */
exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(401)
      .send("Need a valid username, email, and password to create acc");
  }
  try {
    await userService.createAccount(username, email, password);
    res.render('login');
  } catch (err) {
    /* pass error onto global error handler */
    next(err);
  }
};

exports.loginUser = async (req, res, next) =>  { 
  const { username, password } = req.body;
  /* invalid username & password */
  if (!username || !password) {
    const err = new Error("Invalid username or password.");
    throw err;
  }
  try { 
    const userID = await userService.login(username, password);

    /* set up session-related things */
    setSessionUserID(req, userID);
    setSessionUsername(req, username);
    
    return res.redirect("/home");
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
    throw err;
  }
};
exports.viewProfile = async (req, res, next) => {     
  res.status(201).send("profile viewed successfully !");
};

exports.loginPage = async (req, res, next) => {     
  res.render('login');
};

exports.homePage = async(req, res, next) => { 
  res.render('home');
};

exports.signUpPage = async(req, res, next) => { 
  res.render('signup')
};

