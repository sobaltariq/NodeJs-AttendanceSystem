const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  senderId: {
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
  deliveredAt: {
    type: Date,
    default: null,
  },
  readAt: {
    type: Date,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ chatId: 1, timestamp: -1 }); // Index for recent messages

// Middleware to update `deliveredAt` or `readAt` timestamps based on status
messageSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "delivered") {
      this.deliveredAt = new Date();
    }
    if (this.status === "read") {
      this.readAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
