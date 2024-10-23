const { sendMessageServices } = require("../services/sendMessageServices");

const messageHandler = async (socket, { chatId, message }) => {
  try {
    if (!chatId || !message || message.trim() === "") {
      socket.emit("error", "chatId and message are required.");
      return;
    }
    const messageData = {
      chatId,
      senderId: socket.user.id,
      content: message.trim(),
    };

    const savedMessage = await sendMessageServices(socket, messageData);

    if (savedMessage.success) {
      // Broadcast the message to all clients in the chat room
      io.to(chatId).emit("messageReceived", {
        chatId,
        message: savedMessage.message,
      });

      // Optionally, emit an acknowledgment to the sender
      socket.emit("messageSent", {
        chatId,
        message: savedMessage.message,
      });
      console.log(`Message sent to room ${chatId}`);
    } else {
      socket.emit("error", savedMessage.message);
    }
  } catch (error) {
    console.error("Error in messageHandler:", error.message);
    socket.emit("error", "Error sending message.");
  }
};

module.exports = { messageHandler };
