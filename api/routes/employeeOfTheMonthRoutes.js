const express = require("express");
const {
  getCurrentEmployeeOfTheMonth,
  getEmployeeOfTheMonthHistory,
  setEmployeeOfTheMonth,
  updateEmployeeOfTheMonth,
} = require("../controllers/employeeOfTheMonthController");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");
const {
  setEmployeeOfTheMonthValidationRules,
} = require("../../validator/employeeOfTheMonthValidations");

// Employee of the Month routes
const router = express.Router();

router.get("/", verifyLoginToken, getCurrentEmployeeOfTheMonth);
router.get("/history", verifyLoginToken, getEmployeeOfTheMonthHistory);
router.post(
  "/",
  verifyLoginToken,
  checkAdminRole,
  setEmployeeOfTheMonthValidationRules(),
  validateRequest,
  setEmployeeOfTheMonth
);
router.patch(
  // Employee Of The Month id
  "/:id",
  verifyLoginToken,
  checkAdminRole,
  updateEmployeeOfTheMonth
);

module.exports = router;
