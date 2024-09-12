const { body, param, validationResult } = require("express-validator");

// Validation rules for creating a leave request
const createLeaveRequestValidation = [
  body("leaveType")
    .isIn(["sick", "casual", "personal"])
    .withMessage("Invalid leave type")
    .notEmpty()
    .withMessage("Leave type is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Invalid start date")
    .notEmpty()
    .withMessage("Start date is required"),
  body("endDate")
    .isISO8601()
    .withMessage("Invalid end date")
    .notEmpty()
    .withMessage("End date is required"),
  body("reason").optional().isString().withMessage("Reason must be a string"),
];

// Validation rules for updating a leave request
const updateLeaveRequestValidation = () => {
  return [
    body("status")
      .notEmpty()
      .withMessage("status is required")
      .isIn(["pending", "approved", "rejected"])
      .withMessage("Invalid status"),
  ];
};

const validateLeaveDates = (req, res, next) => {
  const { startDate, endDate } = req.body;
  const today = new Date().setHours(0, 0, 0, 0); // Start of today

  if (new Date(startDate).setHours(0, 0, 0, 0) < today) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past.",
    });
  }

  if (new Date(endDate).setHours(0, 0, 0, 0) < today) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be in the past.",
    });
  }

  if (
    new Date(startDate).setHours(0, 0, 0, 0) >
    new Date(endDate).setHours(0, 0, 0, 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "End date cannot be earlier than start date.",
    });
  }

  next();
};

module.exports = {
  createLeaveRequestValidation,
  updateLeaveRequestValidation,
  validateLeaveDates,
};
