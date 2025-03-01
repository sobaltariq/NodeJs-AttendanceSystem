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
      default: () => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)); // Midnight UTC
      } // Resets time to midnight
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "early", "leave"],
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
  if (this.status) {
    return next();
  }
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
    console.log(existingAttendance);

    return next(new Error("Attendance for today already exists."));
  }

  next();
});

// Virtual field to calculate attendance for the current month
attendanceSchema.statics.getCurrentMonthAttendance = function (userId) {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  return this.countDocuments({
    userId: userId,
    todayDate: { $gte: startOfMonth, $lt: endOfMonth },
  });
};

// Method to adjust points based on attendance status
attendanceSchema.post("save", async function () {
  const User = mongoose.model("User");
  let pointsChange = 0;

  switch (this.status) {
    case "absent":
      pointsChange = -5;
      break;
    case "leave":
      pointsChange = -3;
      break;
    case "present":
    case "early":
      pointsChange = 1;
      break;
    case "late":
      pointsChange = -1;
      break;
    default:
      pointsChange = 0;
  }
  try {
    await User.findByIdAndUpdate(this.userId, {
      $inc: { monthlyPoints: pointsChange },
    });
  } catch (error) {
    console.error("Error updating user points:", error);
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
