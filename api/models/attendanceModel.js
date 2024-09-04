const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    todayDate: {
      type: Date,
      default: () => new Date().setHours(0, 0, 0, 0), // Resets time to midnight
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "early"],
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

// Middleware to set the attendance status based on check-in time
attendanceSchema.pre("save", function (next) {
  const checkInHour = this.checkInTime.getHours();

  if (checkInHour < parseInt(process.env.ATTENDANCE_TIME_1, 10)) {
    this.status = "early";
  } else if (
    checkInHour >= parseInt(process.env.ATTENDANCE_TIME_1, 10) &&
    checkInHour < parseInt(process.env.ATTENDANCE_TIME_2, 10)
  ) {
    this.status = "present";
  } else if (
    checkInHour >= parseInt(process.env.ATTENDANCE_TIME_2, 10) &&
    checkInHour < parseInt(process.env.ATTENDANCE_TIME_3, 10)
  ) {
    this.status = "late";
  } else {
    this.status = "absent";
  }

  next();
});

// Middleware to check if a user already has an attendance record for today
attendanceSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Skip check for existing records during updates

  const existingAttendance = await mongoose.model("Attendance").findOne({
    userId: this.userId,
    todayDate: this.todayDate,
  });

  if (existingAttendance) {
    return next(new Error("Attendance for today already exists."));
  }

  next();
});

// Middleware to update timestamps
attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to calculate attendance for the current month
attendanceSchema.virtual("currentMonthAttendance").get(function () {
  const startOfMonth = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth() + 1,
    0
  );

  return mongoose.model("Attendance").countDocuments({
    userId: this.userId,
    todayDate: { $gte: startOfMonth, $lt: endOfMonth },
  });
});

module.exports = mongoose.model("Attendance", attendanceSchema);
