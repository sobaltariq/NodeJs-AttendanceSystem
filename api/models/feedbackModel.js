const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    feedbackType: {
      type: String,
      enum: ["Bug Report", "Feature Request"],
      required: true,
    },
    message: { type: String, required: true },
    screenshot: { type: String },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved"],
      default: "New",
    },
    dateSubmitted: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

feedbackSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
