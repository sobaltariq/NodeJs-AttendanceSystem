const express = require("express");
const {
  getAllNotifications,
  markNotificationAsRead,
  deleteByIdNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");

// Notification routes
const router = express.Router();

router.get("/", verifyLoginToken, getAllNotifications);
router.get("/delete/:id", verifyLoginToken, deleteByIdNotification);
router.get("/", verifyLoginToken, deleteAllNotifications);
router.patch("/:notificationId/read", verifyLoginToken, markNotificationAsRead);

module.exports = router;
