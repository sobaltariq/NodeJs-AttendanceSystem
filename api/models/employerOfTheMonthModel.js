const mongoose = require("mongoose");

const employerOfTheMonthSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    reason: { type: String },
    awardedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

employerOfTheMonthSchema.index(
  { employeeId: 1, year: 1, month: 1 },
  { unique: true }
);

// Middleware to increment the employee's count
employerOfTheMonthSchema.post("save", async function (doc) {
  try {
    await mongoose.model("User").findByIdAndUpdate(doc.employeeId, {
      $inc: { employerOfTheMonthCount: 1 },
    });
  } catch (error) {
    console.error("Error updating employerOfTheMonthCount:", error);
    throw new Error("Failed to increment employerOfTheMonthCount");
  }
});

module.exports = mongoose.model("EmployerOfTheMonth", employerOfTheMonthSchema);
