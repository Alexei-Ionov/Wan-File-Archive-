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
router.post("/user/login", userController.loginUser);


router.get("/profile", authenticate, userController.viewProfile);
/*
 * ADMIN API for testing
 */
router.get("/users", userController.getUsers);

router.get("/login", userController.loginPage);
module.exports = router;
