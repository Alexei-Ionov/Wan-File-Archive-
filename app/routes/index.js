const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authenticate = require('../middleware/authentication')
/*
Account creation: 
    form: 
        username, 
        email, 
        password
*/
router.post("/user/create", userController.createUser);

/* LOGIN */ 
router.get("/login", userController.loginPage);
router.post("/login", userController.loginUser);

/* HOME PAGE */
router.get("/home", userController.homePage);
router.get("/profile", authenticate, userController.viewProfile);
/*
 * ADMIN API for testing
 */
router.get("/users", userController.getUsers);
module.exports = router;
