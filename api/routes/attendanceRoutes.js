const express = require("express");
const attendanceController = require("../controllers/attendanceController");

// Attendance routes
const router = express.Router();

router.post("/", attendanceController.createAttendance);
router.get("/", attendanceController.getAllAttendance);
router.get("/user/:userId", attendanceController.getAttendanceByUserId);
router.put("/:id", attendanceController.updateAttendance);
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
