const express = require("express");
const router = express.Router();
const {
  adminGetAllUsers,
  getUserByIdForAdmin,
  adminUpdateUserById,
  adminDeleteUserById,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require("../controllers/userController");
const {
  userRegistrationValidationRules,
  changePasswordValidationRules,
} = require("../../validator/userValidations");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");
const upload = require("../../middleware/express/multerForImages");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const {
  validateProfilePictureRules,
} = require("../../validator/pictureValidations");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");
const {
  adminUpdateUserValidationRules,
} = require("../../validator/updateProfileValidations");

// User routes

router.post(
  "/register",
  upload.single("profilePicture"),
  // checkAdminRole,
  userRegistrationValidationRules(),
  validateProfilePictureRules,
  validateRequest,
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", verifyLoginToken, logoutUser);

router.get("/profile", verifyLoginToken, getUserProfile);

router.patch(
  "/profile",
  upload.single("profilePicture"),
  validateProfilePictureRules,
  validateRequest,
  verifyLoginToken,
  updateUserProfile
);

// Route for updating password
router.patch(
  "/change-password/:id",
  verifyLoginToken,
  changePasswordValidationRules(),
  validateRequest,
  changePassword
);

// ############ Admin routes ############
router.get("/profiles", verifyLoginToken, checkAdminRole, adminGetAllUsers);
router.get("/:id", verifyLoginToken, checkAdminRole, getUserByIdForAdmin);

router.delete("/:id", verifyLoginToken, checkAdminRole, adminDeleteUserById);

router.patch(
  "/update-user/:id",
  verifyLoginToken,
  checkAdminRole,
  adminUpdateUserValidationRules(),
  validateRequest,
  adminUpdateUserById
);

module.exports = router;
