const {
  INTERNAL_SERVER_ERROR,
  NOTIFICATION_DELETED_SUCCESSFULLY,
} = require("../../utils/errorMessages");
const Notification = require("../models/notificationsModel");

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};
const deleteByIdNotification = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({
      success: true,
      message: NOTIFICATION_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};
const deleteAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};
const markNotificationAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  getAllNotifications,
  deleteByIdNotification,
  deleteAllNotifications,
  markNotificationAsRead,
};
