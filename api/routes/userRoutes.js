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
} = require("../controllers/userController");
const {
  userRegistrationValidationRules,
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

// User routes
router.post(
  "/register",
  upload.single("profilePicture"),
  checkAdminRole,
  userRegistrationValidationRules(),
  validateProfilePictureRules,
  validateRequest,
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", verifyLoginToken, logoutUser);

// Get profile route (authenticated user)
router.get("/profile", verifyLoginToken, getUserProfile);

// Update user profile route (authenticated user)
router.patch(
  "/profile",
  upload.single("profilePicture"),
  validateProfilePictureRules,
  validateRequest,
  verifyLoginToken,
  updateUserProfile
);

// Get user by ID route (admin)
router.get("/:id", verifyLoginToken, checkAdminRole, getUserByIdForAdmin);

// Delete user route (admin)
router.delete("/:id", verifyLoginToken, checkAdminRole, adminDeleteUserById);

// ############ Admin routes ############
// $$$$$$$$$$$$$$

router.get("/", verifyLoginToken, checkAdminRole, adminGetAllUsers);

// Update user route (admin)
router.put("/:id", checkAdminRole, adminUpdateUserById);

module.exports = router;
