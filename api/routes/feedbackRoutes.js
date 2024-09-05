const express = require("express");
const {
  deleteFeedback,
  getAllAndOneFeedback,
  createFeedback,
  updateFeedback,
} = require("../controllers/feedbackController");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");
const {
  feedbackValidationRules,
} = require("../../validator/feedbackValidations");

// Feedback routes
const router = express.Router();

router.post(
  "/",
  verifyLoginToken,
  feedbackValidationRules(),
  validateRequest,
  createFeedback
);

router.get("/", verifyLoginToken, checkAdminRole, getAllAndOneFeedback);

router.patch("/:id", verifyLoginToken, checkAdminRole, updateFeedback);

router.delete("/:id", verifyLoginToken, checkAdminRole, deleteFeedback);

module.exports = router;
