const { body } = require("express-validator");

const userRegistrationValidationRules = () => {
  return [
    // Validate 'name'
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required"),

    // Validate 'email'
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email is required"),

    // Validate 'password'
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
      )
      .withMessage(
        "Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      ),

    // Validate 'role' (optional)
    body("role")
      .isIn(["user", "admin", "superAdmin"])
      .withMessage("Invalid role"),
  ];
};

module.exports = {
  userRegistrationValidationRules,
};
