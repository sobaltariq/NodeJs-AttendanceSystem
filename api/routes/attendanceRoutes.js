const express = require("express");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");

const {
  markAttendance,
  getTodayAttendanceForAllUsers,
  getAttendanceForCurrentMonth,
  getAttendanceForAllTime,
  getAttendanceForCurrentYear,
  getAttendanceByUserId,
  getMyAttendanceByMonth,
  updateAttendance,
} = require("../controllers/attendanceController");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");

// Attendance routes
const router = express.Router();

router.post("/", verifyLoginToken, markAttendance);
router.get(
  "/all-time",
  verifyLoginToken,
  checkAdminRole,
  getAttendanceForAllTime
);
router.get(
  "/today",
  verifyLoginToken,
  checkAdminRole,
  getTodayAttendanceForAllUsers
);
router.get(
  "/month",
  verifyLoginToken,
  checkAdminRole,
  getAttendanceForCurrentMonth
);
router.get(
  "/year",
  verifyLoginToken,
  checkAdminRole,
  getAttendanceForCurrentYear
);

router.get("/user/month", verifyLoginToken, getMyAttendanceByMonth);
router.get("/user/:userId", verifyLoginToken, getAttendanceByUserId);
router.patch("/:userId", verifyLoginToken, checkAdminRole, updateAttendance);

module.exports = router;
