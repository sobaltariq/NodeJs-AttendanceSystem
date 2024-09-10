const { body, validationResult } = require("express-validator");

// Validation rules for setting Employee of the Month
const setEmployeeOfTheMonthValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string"),
    body("month")
      .notEmpty()
      .withMessage("Month is required")
      .isString()
      .withMessage("Month must be a string"),
    body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be a valid year"),
    body("reason").optional().isString().withMessage("Reason must be a string"),
  ];
};

module.exports = { setEmployeeOfTheMonthValidationRules };
