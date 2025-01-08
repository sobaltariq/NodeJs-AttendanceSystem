const { body } = require("express-validator");

const userRegistrationValidationRules = () => {
  return [
    // Validate 'name'
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters")
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
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/
      )
      .withMessage(
        "Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      ),
    body("gender").optional().isIn(["male", "female", "other"]),

    // Validate 'role' (optional)
    body("role")
      .isIn(["user", "admin", "superAdmin"])
      .withMessage("Invalid role"),
  ];
};

const changePasswordValidationRules = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New Password must be at least 8 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
      )
      .withMessage(
        "New Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      )
      .custom((value, { req }) => {
        if (value === req.body.oldPassword) {
          throw new Error(
            "New password should not be the same as the old password"
          );
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("New and old passwords do not match");
        }
        return true;
      }),
  ];
};
module.exports = {
  userRegistrationValidationRules,
  changePasswordValidationRules,
};
