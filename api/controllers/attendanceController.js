const {
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ATTENDANCE_ENTRY,
} = require("../../utils/errorMessages");
const attendanceModel = require("../models/attendanceModel");
const Attendance = require("../models/attendanceModel");

// Create a new attendance record
createAttendance = async (req, res) => {
  try {
    let userId;
    if (req.user.role === "user") {
      userId = req.user.id;

      console.log("user", userId);
    } else {
      userId = req.body.userId;
      console.log("admin", userId);
    }

    // Check if an attendance record already exists for today
    const existingAttendance = await attendanceModel.findOne({
      userId,
      todayDate: new Date().setHours(0, 0, 0, 0),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: DUPLICATE_ATTENDANCE_ENTRY,
      });
    }
    res.status(201).json("attendance");
  } catch (error) {
    res.status(400).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Get all attendance records
getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get attendance by user ID
getAttendanceByUserId = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.userId });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an attendance record by ID
updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attendance)
      return res.status(404).json({ error: "Attendance not found" });
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an attendance record by ID
deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance)
      return res.status(404).json({ error: "Attendance not found" });
    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceByUserId,
  updateAttendance,
  deleteAttendance,
};
