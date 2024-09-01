const express = require("express");
const feedbackController = require("../controllers/feedbackController");

// Feedback routes
const router = express.Router();

router.post("/", feedbackController.createFeedback);
router.get("/", feedbackController.getAllFeedback);
router.get("/:id", feedbackController.getFeedbackById);
router.put("/:id", feedbackController.updateFeedback);
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
