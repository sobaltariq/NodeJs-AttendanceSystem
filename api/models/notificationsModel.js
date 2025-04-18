const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "alert"], default: "info" },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    dateSent: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for quick retrieval of unread notifications
notificationSchema.index({ userId: 1, status: 1 });

// TTL index for automatic deletion of expired notifications (optional)
if (notificationSchema.paths.expiresAt) {
  notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

// Middleware to mark notification as read
notificationSchema.methods.markAsRead = async function () {
  this.status = "read";
  this.expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Set expiresAt to 3 days from now
  await this.save();
};

module.exports = mongoose.model("Notification", notificationSchema);
