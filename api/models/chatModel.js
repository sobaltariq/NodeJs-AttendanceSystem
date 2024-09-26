const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    chatType: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
    groupName: {
      type: String,
      trim: true,
      required: function () {
        return this.chatType === "group";
      },
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        unique: true, // Ensures no duplicate participants per chat
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.chatType === "group";
      },
      default: null,
    },
  },
  { timestamps: true }
);

// Create a compound index on chatType and participants.userId for efficient querying
chatSchema.index({ chatType: 1, "participants.userId": 1 });

// Optional: Create a text index for searching group names (useful for search functionality)
chatSchema.index({ groupName: "text" });

module.exports = mongoose.model("Chat", chatSchema);
