const { check, validationResult } = require("express-validator");

// Validation rules for creating an attendance record
const attendanceValidationRules = [
  check("status")
    .isIn(["present", "absent", "late", "early", "on_leave"])
    .withMessage(
      "Status must be one of 'present', 'absent', 'late', 'early', or 'on_leave'."
    ),

  check("location.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90."),

  check("location.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180."),
];

module.exports = {
  attendanceValidationRules,
};
