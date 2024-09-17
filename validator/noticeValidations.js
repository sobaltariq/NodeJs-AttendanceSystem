const { body } = require("express-validator");

const createNoticeValidationRules = () => {
  return [
    body("title")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long.")
      .trim(),
    body("content")
      .isString()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long.")
      .trim(),
    body("type")
      .isIn(["Reminder", "Alert", "Notice"])
      .withMessage("Type must be one of Reminder, Alert, or Notice."),
    body("expiryDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Expiry date must be a valid date format."),
  ];
};

const updateNoticeValidationRules = () => {
  return [
    body("title")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long.")
      .trim(),
    body("content")
      .isString()
      .isLength({ min: 10 })
      .withMessage("Content must be at least 10 characters long.")
      .trim(),
    body("type")
      .isIn(["Reminder", "Alert", "Notice"])
      .withMessage("Type must be one of Reminder, Alert, or Notice."),
  ];
};

module.exports = {
  createNoticeValidationRules,
  updateNoticeValidationRules,
};
