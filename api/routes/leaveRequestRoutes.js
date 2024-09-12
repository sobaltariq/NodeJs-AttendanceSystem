const express = require("express");
const {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  getLeaveRequestByUser,
  updateLeaveRequest,
  deleteLeaveRequest,
} = require("../controllers/leaveRequestController");
const {
  createLeaveRequestValidation,
  validateLeaveDates,
  updateLeaveRequestValidation,
} = require("../../validator/leaveRequestValidations");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");

// Leave Request routes
const router = express.Router();

router.post(
  "/",
  verifyLoginToken,
  validateLeaveDates,
  createLeaveRequestValidation,
  validateRequest,
  createLeaveRequest
);
router.get("/", verifyLoginToken, checkAdminRole, getAllLeaveRequests);
router.get("/:id", verifyLoginToken, getLeaveRequestById);
router.get("/me/:userId", verifyLoginToken, getLeaveRequestByUser);
router.patch(
  "/:id",
  updateLeaveRequestValidation(),
  validateRequest,
  verifyLoginToken,
  checkAdminRole,
  updateLeaveRequest
);
router.delete("/:id", deleteLeaveRequest);

module.exports = router;
