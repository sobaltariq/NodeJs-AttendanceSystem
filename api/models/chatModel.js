const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: [true, "Message content is required"],
    maxLength: [500, "Message cannot be more than 500 characters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Main chat schema to support both one-on-one and group chats
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
        ref: "User",
        required: true,
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.chatType === "group";
      },
    },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

// Indexes
chatSchema.index({ chatType: 1 });

module.exports = mongoose.model("Chat", chatSchema);
