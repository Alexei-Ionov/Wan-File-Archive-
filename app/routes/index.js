const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require('../middleware/authentication');
const fileController = require('../controllers/fileController');
const { upload } = require('../config/aws');
const commentController = require('../controllers/commentController');
/* <--------- ACCOUNT CREATION ---------> */
// router.get("/signup", userController.signUpPage);
router.post("/signup", userController.createUser);

/* <--------- LOGIN ---------> */
router.post("/login", userController.loginUser);

/* <--------- LOGOUT ---------> */
router.post("/logout", authenticate, userController.logout);

/* <--------- VIEW FILE CONTENT ---------> */
router.get("/content/view", authenticate, fileController.getFileContents);

/* <--------- GET FILE METADATA ---------> */
router.get("/content/metadata", authenticate, fileController.loadFilesMetadata);

/* <--------- VIEW PROFILE (can be user profile or other person's profile) ---------> */
router.get("/profile", authenticate, userController.viewProfile); //profile info
router.get("/profile/content", authenticate, userController.viewProfileContent); //files for profile

/* <--------- CONTRIBUTE ---------> */
// router.post("/contribute", authenticate, fileController.uploadFile); commented FOR TESTING PURPOSES
router.post("/contribute", authenticate, upload.single('file'), fileController.uploadFile);
// router.get("/contribute", fileController.contributePage);

/* <--------- VIEW LEADERBOARD ---------> */

router.get("/leaderboard", userController.viewLeaderboard); //files for profile

/* <--------- VOTE FILE ---------> */
router.post("/content/vote", authenticate, fileController.voteFile);
// router.post("/home/vote", authenticate, fileController.voteFile);

/* <--------- COMMENTS ---------> */
router.get("/content/comment", authenticate, commentController.viewComments); //files for profile
router.get("/comment/count", authenticate, commentController.getCommentCount);
router.post("/content/add-comment", authenticate, commentController.addComment);
router.post("/comment/vote", authenticate, commentController.voteComment);
/* <--------- ADMIN ---------> */
router.get("/users", userController.getUsers);
module.exports = router;
