const express = require("express");
const {
  requestSensitiveFieldUpdateValidationRules,
} = require("../../validator/updateProfileValidations");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const {
  requestSensitiveFieldUpdate,
  adminReviewUpdateRequest,
} = require("../controllers/updateProfileController");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");

const router = express.Router();

// Update user routes
router.patch(
  "/request-update",
  requestSensitiveFieldUpdateValidationRules(),
  validateRequest,
  verifyLoginToken,
  requestSensitiveFieldUpdate
);

router.patch(
  "/review/:requestId",
  verifyLoginToken,
  checkAdminRole,
  adminReviewUpdateRequest
);

module.exports = router;
