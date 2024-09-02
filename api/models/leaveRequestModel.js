const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ["sick", "casual", "personal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isPaidLeave: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "none" },
    approvalDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient leave request search
leaveRequestSchema.index({ userId: 1, startDate: 1, endDate: 1 });

// Middleware to update leave balance and track leaves
leaveRequestSchema.post("save", async function (doc) {
  if (doc.status === "approved") {
    const user = await mongoose.model("User").findById(doc.userId);
    if (user) {
      const daysTaken =
        Math.ceil((doc.endDate - doc.startDate) / (1000 * 60 * 60 * 24)) + 1;
      const update = {
        $inc: { leavesTakenThisYear: daysTaken, leaveBalance: -daysTaken },
      };
      await user.updateOne(update);
    }
  }
});

// Middleware to restrict leave applications
leaveRequestSchema.pre("validate", async function (next) {
  const user = await mongoose.model("User").findById(this.userId);
  const year = new Date().getFullYear();
  const leavesTakenThisYear = user.leavesTakenThisYear || 0;

  if (leavesTakenThisYear >= 10) {
    return next(
      new Error("You have reached the maximum number of leaves for this year.")
    );
  }

  next();
});

// Middleware to update timestamps
leaveRequestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
