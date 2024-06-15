const userService = require("../services/userService");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    return res.status(201).json(users);
  } catch (err) {
    console.log(err.message);
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
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err.message);
    /* case where username already exists */
    if (err.name == "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    /* pass error onto global error handler */
    next(err);
  }
};


exports.loginUser = async (req, res, next) =>  { 
  const { username, password } = req.body;
  /* invalid username & password */
  if (!username || !password) {
    const err = new Error("Invalid username or password.");
    return res.status(401).json({error: err});
  }
  try { 
    const userInfo = await userService.login(username, password);
    return res.status(200).json(userInfo);
  } catch (err) {
    next(err);
  }
};