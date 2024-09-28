const mongoose = require("mongoose");

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
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.chatType === "group";
      },
      default: null,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient querying
chatSchema.index({ chatType: 1, groupName: 1 });

module.exports = mongoose.model("Chat", chatSchema);
