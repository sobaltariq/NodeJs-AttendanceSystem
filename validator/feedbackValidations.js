const { body } = require("express-validator");

// Middleware for feedback validation
const feedbackValidationRules = () => {
  return [
    body("feedbackType")
      .isIn(["Bug Report", "Feature Request"])
      .withMessage("Invalid feedback type")
      .notEmpty()
      .withMessage("Feedback type is required"),

    body("message")
      .isString()
      .withMessage("Message must be a string")
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters long"),

    body("screenshot")
      .optional()
      .isString()
      .withMessage("Invalid screenshot URL"),
  ];
};

module.exports = { feedbackValidationRules };
