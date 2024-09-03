const express = require("express");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");

const { createAttendance } = require("../controllers/attendanceController");

// Attendance routes
const router = express.Router();

router.post("/", verifyLoginToken, createAttendance);
// router.get("/", verifyLoginToken, getAllAttendance);
// router.get("/user/:userId", verifyLoginToken, getAttendanceByUserId);
// router.put("/:id", verifyLoginToken, updateAttendance);
// router.delete("/:id", verifyLoginToken, deleteAttendance);

module.exports = router;
