const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require('../middleware/authentication');
const fileController = require('../controllers/fileController');
const { upload } = require('../config/aws');

/* <--------- ACCOUNT CREATION ---------> */
// router.get("/signup", userController.signUpPage);
router.post("/signup", userController.createUser);

/* <--------- LOGIN ---------> */
// router.get("/login", userController.loginPage);
router.post("/login", userController.loginUser);

/* <--------- LOGOUT ---------> */
router.post("/logout", authenticate, userController.logout);

/* <--------- HOME ---------> */
// router.get("/home", userController.homePage);
router.post("/home", fileController.loadFilesMetadata);


/* <--------- VIEW FILE ---------> */
router.get("/getFile", authenticate, fileController.getFileContents);


/* <--------- PROFILE ---------> */
router.get("/profile", userController.viewProfile);

/* <--------- CONTRIBUTE ---------> */
// router.post("/contribute", authenticate, fileController.uploadFile); commented FOR TESTING PURPOSES
router.post("/contribute", authenticate, upload.single('file'), fileController.uploadFile);
// router.get("/contribute", fileController.contributePage);


/* <--------- VOTE FILE ---------> */
router.post("/home/vote", fileController.voteFile);
// router.post("/home/vote", authenticate, fileController.voteFile);



/* <--------- ADMIN ---------> */
router.get("/users", userController.getUsers);
module.exports = router;
