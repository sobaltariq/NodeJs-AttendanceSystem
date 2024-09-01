const express = require("express");
const leaveRequestController = require("../controllers/leaveRequestController");

// Leave Request routes
const router = express.Router();

router.post("/", leaveRequestController.createLeaveRequest);
router.get("/", leaveRequestController.getAllLeaveRequests);
router.get("/:id", leaveRequestController.getLeaveRequestById);
router.put("/:id", leaveRequestController.updateLeaveRequest);
router.delete("/:id", leaveRequestController.deleteLeaveRequest);

module.exports = router;
