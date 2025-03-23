const { sendMessageServices } = require("../services/sendMessageServices");

const messageHandler = async (io, socket, { chatId, message }) => {
  try {
    if (!chatId || !message || message.trim() === "") {
      socket.emit("error", { message: "chatId and message are required." });
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
      // console.log(`Broadcasting to room ${chatId}:`, savedMessage.message);
      // console.log("Connected clients in room:", io.sockets.adapter.rooms.get(chatId)?.size || 0);

    } else {
      console.log('savedMessage.message', savedMessage.message);
      socket.emit("error", savedMessage);
    }
  } catch (error) {
    console.error("Error in messageHandler:", error.message);
    socket.emit("error", { message: "Error sending message." });
  }
};

module.exports = { messageHandler };
