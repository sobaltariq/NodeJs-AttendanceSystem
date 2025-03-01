const {
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ATTENDANCE_ENTRY,
  USER_NOT_FOUND,
  ATTENDANCE_NOT_FOUND,
  ATTENDANCE_CREATED_SUCCESSFULLY,
  UNAUTHORIZED_ACCESS,
  INVALID_ATTENDANCE_STATUS,
  INVALID_DATE_FORMAT,
  ATTENDANCE_ALREADY_UPDATED,
} = require("../../utils/errorMessages");
const attendanceModel = require("../models/attendanceModel");
const userModel = require("../models/userModel");

// Create a new attendance record
const markAttendance = async (req, res) => {
  try {
    let userId;
    if (req.user.role === "user") {
      userId = req.user.id;

      console.log("user", userId);
    } else {
      userId = req.body.userId;
      console.log("admin", userId);
    }

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));


    console.log(startOfDay, endOfDay);

    // Check if an attendance record already exists for today
    const existingAttendance = await attendanceModel.findOne({
      userId,
      todayDate: {
        $gte: startOfDay,
        $lt: endOfDay
      },
    });

    if (existingAttendance) {
      console.log(existingAttendance.todayDate);

      return res.status(400).json({
        success: false,
        message: DUPLICATE_ATTENDANCE_ENTRY,
      });
    }

    // Create a new attendance record
    const newAttendance = new attendanceModel({
      userId,
      startOfDay,
      status: "present",
    });

    await newAttendance.save();

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $push: { attendanceHistory: newAttendance._id } },
      {
        new: true,
      }
    );
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: USER_NOT_FOUND,
      });
    }

    return res.status(201).json({
      success: true,
      message: ATTENDANCE_CREATED_SUCCESSFULLY,
      newAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to get today's attendance records for all users
const getTodayAttendanceForAllUsers = async (req, res) => {
  try {
    const todayDate = new Date().setHours(0, 0, 0, 0);
    console.log(todayDate);

    const todayAttendanceRecords = await attendanceModel.find({ todayDate });
    if (!todayAttendanceRecords) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }
    res.status(200).json({
      success: true,
      todayAttendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to get attendance records for all users for the current month
const getAttendanceForCurrentMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    const targetMonth = month ? parseInt(month, 10) : new Date().getMonth();
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

    const attendanceRecords = await attendanceModel.find({
      todayDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (!attendanceRecords) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }
    res.status(200).json({
      success: true,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to get attendance records for all users for the current year
const getAttendanceForCurrentYear = async (req, res) => {
  try {
    const { year } = req.query;

    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear + 1, 0, 0);

    const attendanceRecords = await attendanceModel.find({
      todayDate: { $gte: startOfYear, $lt: endOfYear },
    });

    if (!attendanceRecords.length) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }
    res.status(200).json({
      success: true,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to get attendance records for all users for all time
const getAttendanceForAllTime = async (req, res) => {
  try {
    const attendances = await attendanceModel.find();

    if (!attendances.length) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }

    res.status(200).json({ success: true, data: attendances });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Get attendance by user ID
const getAttendanceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;
    console.log(userId, id);

    // If the id in the request body matches the userId in the URL, proceed
    if (id && id === userId) {
      const attendance = await attendanceModel.find({ userId });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: ATTENDANCE_NOT_FOUND,
        });
      }

      return res.status(200).json({ success: true, data: attendance });
    }

    // If id doesn't match userId, check if the user is an admin
    if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: UNAUTHORIZED_ACCESS,
      });
    }
    // Proceed to get attendance if the user is an admin or super admin
    const attendance = await attendanceModel.find({ userId });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const getMyAttendanceByMonth = async (req, res) => {

  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({ success: false, error: MONTH_YEAR_REQUIRED });
    }

    const targetMonth = month ? parseInt(month, 10) - 1 : new Date().getMonth();
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const startOfNextMonth = new Date(targetYear, targetMonth + 1, 1);


    const attendanceRecords = await attendanceModel.find({
      userId: userId,
      todayDate: { $gt: startOfMonth, $lte: startOfNextMonth },
    });

    // Print log for debugging date ranges
    // console.log("User ID:", userId);
    // console.log("Target Month:", targetMonth + 1);
    // console.log("Target Year:", targetYear);
    // console.log("Start of Month:", startOfMonth.toISOString());
    // console.log("Start of Next Month:", startOfNextMonth.toISOString());

    // console.log("Attendance Records:", attendanceRecords);


    if (!attendanceRecords) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }
    res.status(200).json({
      success: true,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Update an attendance record by ID
const updateAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, todayDate } = req.body;

    const parsedDate = new Date(todayDate);
    parsedDate.setHours(0, 0, 0, 0);

    console.log(parsedDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: INVALID_DATE_FORMAT,
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: INVALID_ATTENDANCE_STATUS,
      });
    }

    // Find the attendance record for the given user and date
    const attendance = await attendanceModel.findOne({
      userId,
      todayDate: parsedDate,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: ATTENDANCE_NOT_FOUND,
      });
    }
    if (attendance.status === status) {
      return res.status(400).json({
        success: false,
        message: `${ATTENDANCE_ALREADY_UPDATED} to ${status}`,
      });
    }

    attendance.status = status;
    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  markAttendance,
  getTodayAttendanceForAllUsers,
  getAttendanceForCurrentMonth,
  getAttendanceForCurrentYear,
  getAttendanceForAllTime,
  getAttendanceByUserId,
  getMyAttendanceByMonth,
  updateAttendance,
};
