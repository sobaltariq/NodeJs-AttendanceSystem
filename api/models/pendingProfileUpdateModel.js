const mongoose = require("mongoose");

const pendingUpdateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updateRequest: {
      type: Map,
      of: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming admin users are also in the User model
    },
  },
  { timestamps: true }
);

// Middleware to delete the document 24 hours after it's not pending
pendingUpdateSchema.post("save", function (doc) {
  if (doc.status === "approved" || doc.status === "rejected") {
    setTimeout(async () => {
      try {
        await mongoose.model("PendingUpdate").findByIdAndDelete(doc._id);
        console.log(
          `Profile update request ${doc._id} has been deleted after 24 hours.`
        );
      } catch (error) {
        console.error(
          `Error deleting pending update request ${doc._id}:`,
          error
        );
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
    // }, 1 * 1000); // 24 hours
  }
});
// Add index to improve query performance
pendingUpdateSchema.index({ status: 1, requestedAt: 1 });

module.exports = mongoose.model("PendingUpdate", pendingUpdateSchema);
