const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    todayDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["present", "absent", "late", "early", "on_leave"],
      required: true,
    },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

// Index to speed up attendance queries
attendanceSchema.index({ userId: 1, todayDate: 1 }, { unique: true });

// Middleware to validate attendance data
attendanceSchema.pre("save", function (next) {
  if (!this.userId || !this.status) {
    return next(new Error("User ID and status are required."));
  }
  next();
});

// Middleware to update timestamps
attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
