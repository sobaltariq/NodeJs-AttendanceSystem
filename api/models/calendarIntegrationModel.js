const mongoose = require("mongoose");

const calendarIntegrationSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    calendarSyncEnabled: { type: Boolean, default: false },
    lastSyncDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CalendarIntegration",
  calendarIntegrationSchema
);
