const mongoose = require("mongoose");

const employeeOfTheMonthSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    reason: { type: String },
    awardedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

employeeOfTheMonthSchema.index(
  { employeeId: 1, year: 1, month: 1 },
  { unique: true }
);

// Middleware to increment the employee's count
employeeOfTheMonthSchema.post("save", async function (doc) {
  try {
    await mongoose.model("User").findByIdAndUpdate(doc.employeeId, {
      $inc: { employeeOfTheMonthCount: 1 },
    });
  } catch (error) {
    console.error("Error updating employeeOfTheMonthCount:", error);
    throw new Error("Failed to increment employeeOfTheMonthCount");
  }
});

module.exports = mongoose.model("EmployeeOfTheMonth", employeeOfTheMonthSchema);
