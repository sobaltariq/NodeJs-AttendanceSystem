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

    body("role")
      .optional()
      .isIn(["user", "admin", "superAdmin"])
      .withMessage("Invalid role provided."),

    body("gender").optional().isIn(["male", "female", "other"]),

    body("bankName").optional().isString().withMessage("Invalid bank name."),

    body("ibanNumber").optional().isIBAN().withMessage("Invalid IBAN number."),

    body("whatsApp")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid WhatsApp number."),

    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number."),

    body("salary").optional().isString().withMessage("Invalid salary."),

    body("nic").optional().isString().withMessage("Invalid salary."),

    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Date of Birth must be a valid date."),

    body("address").optional().isString().withMessage("Invalid address."),

    body("emergencyContact")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid emergency contact number."),

    body("jobTitle").optional().isString().withMessage("Invalid job title."),

    body("department")
      .optional()
      .isString()
      .withMessage("Invalid department name."),

    body("officeLocation")
      .optional()
      .isString()
      .withMessage("Invalid office location."),

    body("position").optional().isString().withMessage("Invalid position."),
    body("userStatus").optional().isString().withMessage("Invalid position."),

    body("paidLeavesTaken")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Paid leaves taken must be a non-negative integer."),
  ];
};

module.exports = {
  requestSensitiveFieldUpdateValidationRules,
  adminUpdateUserValidationRules,
};
