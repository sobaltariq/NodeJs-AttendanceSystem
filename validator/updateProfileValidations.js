const { body } = require("express-validator");

const requestSensitiveFieldUpdateValidationRules = () => {
  return [
    // Validate name
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string.")
      .isLength({ min: 1 })
      .withMessage("Name cannot be empty."),

    // Validate email
    body("email").optional().isEmail().withMessage("Invalid email format."),

    // Validate bankName
    body("bankName")
      .optional()
      .isString()
      .withMessage("Bank name must be a string.")
      .isLength({ min: 1 })
      .withMessage("Bank name cannot be empty."),

    // Validate ibanNumber
    body("ibanNumber")
      .optional()
      .isString()
      .withMessage("IBAN number must be a string.")
      .isLength({ min: 1 })
      .withMessage("IBAN number cannot be empty."),

    // Validate whatsApp
    body("whatsApp")
      .optional()
      .isString()
      .withMessage("WhatsApp number must be a string.")
      .isLength({ min: 1 })
      .withMessage("WhatsApp number cannot be empty."),

    // Validate accountNumber
    body("accountNumber")
      .optional()
      .isString()
      .withMessage("Account number must be a string.")
      .isLength({ min: 1 })
      .withMessage("Account number cannot be empty."),

    // Validate address
    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string.")
      .isLength({ min: 1 })
      .withMessage("Address cannot be empty."),
  ];
};

const adminUpdateUserValidationRules = () => {
  return [
    body("name").optional().notEmpty().withMessage("Name cannot be empty."),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    body("role")
      .optional()
      .isIn(["user", "admin", "superAdmin"])
      .withMessage("Invalid role provided."),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("whatsApp")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid WhatsApp number."),
    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number."),
    body("ibanNumber").optional().isIBAN().withMessage("Invalid IBAN number."),
    body("address").optional().isString().withMessage("Invalid address."),
    body("emergencyContact")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid emergency contact number."),
    body("profilePicture")
      .optional()
      .isString()
      .withMessage("Invalid profile picture URL."),
    body("bankName").optional().isString().withMessage("Invalid bank name."),
    body("department")
      .optional()
      .isString()
      .withMessage("Invalid department name."),
    body("jobTitle").optional().isString().withMessage("Invalid job title."),
    body("officeLocation")
      .optional()
      .isString()
      .withMessage("Invalid office location."),
    body("position").optional().isString().withMessage("Invalid position."),
    body("leaveBalance")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Leave balance must be a non-negative integer."),
    body("lastLogin").optional().isISO8601().withMessage("Invalid date."),
    body("hireDate").optional().isISO8601().withMessage("Invalid date."),
  ];
};

module.exports = {
  requestSensitiveFieldUpdateValidationRules,
  adminUpdateUserValidationRules,
};
