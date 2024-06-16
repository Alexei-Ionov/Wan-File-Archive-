const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authenticate = require('../middleware/authentication')

/* <--------- ACCOUNT CREATION ---------> */
router.get("/signup", userController.signUpPage)
router.post("/signup", userController.createUser);

/* <--------- LOGIN ---------> */
router.get("/login", userController.loginPage);
router.post("/login", userController.loginUser);

/* <--------- HOME ---------> */
router.get("/home", userController.homePage);
router.get("/profile", authenticate, userController.viewProfile);





/* <--------- ADMIN ---------> */
router.get("/users", userController.getUsers);
module.exports = router;
