const express = require("express");
const {
  deleteFeedback,
  getFeedbackById,
  getAllFeedback,
  createFeedback,
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
router.get("/", verifyLoginToken, checkAdminRole, getAllFeedback);
router.get("/:id", verifyLoginToken, checkAdminRole, getFeedbackById);
router.delete("/:id", verifyLoginToken, checkAdminRole, deleteFeedback);

module.exports = router;
