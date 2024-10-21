const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: { type: Date, default: Date.now },
});

// Ensure uniqueness of user in a chat
participantSchema.index({ chatId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);
