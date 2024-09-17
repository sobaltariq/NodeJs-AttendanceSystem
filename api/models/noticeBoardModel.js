const mongoose = require("mongoose");

const noticeBoardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Reminder", "Alert", "Notice"],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

noticeBoardSchema.index({ createdBy: 1, type: 1, title: 1 });

module.exports = mongoose.model("NoticeBoard", noticeBoardSchema);
