const LeaveRequest = require("../models/leaveRequestModel");

// Create a new leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest(req.body);
    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leave requests
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leave request by ID
exports.getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest)
      return res.status(404).json({ error: "Leave request not found" });
    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a leave request by ID
exports.updateLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!leaveRequest)
      return res.status(404).json({ error: "Leave request not found" });
    res.json(leaveRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a leave request by ID
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!leaveRequest)
      return res.status(404).json({ error: "Leave request not found" });
    res.json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
