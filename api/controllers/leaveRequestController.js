const {
  USER_NOT_FOUND,
  LEAVE_REQUEST_CREATED_SUCCESSFULLY,
  INTERNAL_SERVER_ERROR,
  LEAVE_REQUEST_NOT_FOUND,
  LEAVE_REQUEST_UPDATED_SUCCESSFULLY,
  LEAVE_REQUEST_DELETED_SUCCESSFULLY,
  LEAVE_BALANCE_INSUFFICIENT,
  LEAVE_REQUEST_ALREADY_FOUND,
  STATUS_IS_REQUIRED,
  INVALID_LEAVE_DATES,
  DIFFERENT_START_AND_END_DATE,
} = require("../../utils/errorMessages");
const userModel = require("../models/userModel");
const leaveRequestModel = require("../models/leaveRequestModel");

// Create a new leave request
const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const userId = req.user.id;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: USER_NOT_FOUND,
      });
    }


    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: INVALID_LEAVE_DATES,
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: DIFFERENT_START_AND_END_DATE,
      });
    }

    // Calculate the number of leave days
    const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check if the user has enough leave balance
    if (user.leaveBalance < daysRequested) {
      return res.status(400).json({
        success: false,
        daysRequested: daysRequested,
        message: LEAVE_BALANCE_INSUFFICIENT,
      });
    }

    // Check for existing leave requests that overlap with the new request
    const existingRequests = await leaveRequestModel.find({
      userId,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingRequests.length > 0) {
      return res.status(400).json({
        success: false,
        daysRequested: daysRequested,
        message: LEAVE_REQUEST_ALREADY_FOUND,
      });
    }

    // Create the leave request
    const leaveRequest = new leaveRequestModel({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      daysRequested,
    });

    await leaveRequest.save();

    await userModel.findByIdAndUpdate(
      userId,
      { $push: { leaveRequests: leaveRequest._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: LEAVE_REQUEST_CREATED_SUCCESSFULLY,
      data: leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Get a single leave request by ID
const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequestId = req.params.id;
    const leaveRequest = await leaveRequestModel.findById(leaveRequestId);
    // .populate("userId");

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: LEAVE_REQUEST_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const getLeaveRequestByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate("leaveRequests").populate("paidLeavesTaken").populate("leaveBalance");
    // .populate("userId");

    if (user.leaveRequests.length < 0) {
      return res.status(404).json({
        success: false,
        message: LEAVE_REQUEST_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      total: user.leaveRequests.length,
      leavesTaken: user.paidLeavesTaken,
      leavesBalance: user.leaveBalance,
      data: user.leaveRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Update a leave request by ID
const updateLeaveRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveRequestId = req.params.id;
    const userId = req.user.id;

    // Find the leave request by ID
    const leaveRequest = await leaveRequestModel.findById(leaveRequestId);
    if (!leaveRequest) {
      return res.status(404).json({
        error: false,
        message: LEAVE_REQUEST_NOT_FOUND,
      });
    }

    // Check if the status is already the same as requested
    if (leaveRequest.status === status) {
      return res.status(400).json({
        error: false,
        message: `Already ${status}`,
      });
    }

    // Find the user associated with this leave request
    const user = await userModel.findById(leaveRequest.userId);
    if (!user) {
      return res.status(404).json({
        error: false,
        message: USER_NOT_FOUND,
      });
    }

    if (status === "approved") {
      // Check if the user has enough leave balance
      if (user.leaveBalance < leaveRequest.daysRequested) {
        return res.status(400).json({
          error: false,
          message: LEAVE_BALANCE_INSUFFICIENT,
        });
      }

      // Update user's leave balance and paid leaves taken
      user.leaveBalance -= leaveRequest.daysRequested;
      user.paidLeavesTaken += leaveRequest.daysRequested;
    } else if (status === "rejected" && leaveRequest.status === "approved") {
      // Restore leave balance and decrease paid leaves taken if previously approved
      user.leaveBalance += leaveRequest.daysRequested;
      user.paidLeavesTaken -= leaveRequest.daysRequested;
    }

    // Save user changes if any
    await user.save();

    // Update the leave request status and who approved/rejected it
    leaveRequest.status = status;
    leaveRequest.approvedBy = userId;

    // Save the updated leave request
    await leaveRequest.save();

    res.status(200).json({
      success: true,
      message: LEAVE_REQUEST_UPDATED_SUCCESSFULLY,
      data: leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Delete a leave request by ID
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await leaveRequestModel.findByIdAndDelete(
      req.params.id
    );

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: LEAVE_REQUEST_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      message: LEAVE_REQUEST_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Get all leave requests (Admin only)
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await leaveRequestModel.find().populate("userId");

    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  getLeaveRequestByUser,
  updateLeaveRequest,
  deleteLeaveRequest,
};
