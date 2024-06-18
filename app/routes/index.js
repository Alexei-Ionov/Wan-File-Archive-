const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authenticate = require('../middleware/authentication');
const fileController = require('../controllers/fileController');
const { upload } = require('../config/aws');

/* <--------- ACCOUNT CREATION ---------> */
router.get("/signup", userController.signUpPage)
router.post("/signup", userController.createUser);

/* <--------- LOGIN ---------> */
router.get("/login", userController.loginPage);
router.post("/login", userController.loginUser);

/* <--------- HOME ---------> */
router.get("/home", userController.homePage);
router.get("/profile", authenticate, userController.viewProfile);


/* <--------- CONTRIBUTE ---------> */
// router.post("/contribute", authenticate, fileController.uploadFile); commented FOR TESTING PURPOSES
router.post("/contribute", authenticate, upload.single('file'), fileController.uploadFile);
router.get("/contribute", fileController.contributePage);


/* <--------- ADMIN ---------> */
router.get("/users", userController.getUsers);
module.exports = router;
