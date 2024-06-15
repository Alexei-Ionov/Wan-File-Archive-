const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

/*
Account creation: 
    form: 
        username, 
        email, 
        password
*/
router.post("/user/create", userController.createUser);


router.post("/user/login", userController.loginUser);

/*
 * ADMIN API for testing
 */
router.get("/users", userController.getUsers);

module.exports = router;
