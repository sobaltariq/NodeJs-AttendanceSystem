const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: [500, "Message cannot be more than 500 characters"],
  },
  attachments: [
    {
      type: String, // Store URLs or paths to attachments
    },
  ],
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ chatId: 1, timestamp: -1 }); // Index for recent messages

module.exports = mongoose.model("Message", messageSchema);
