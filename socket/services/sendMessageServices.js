const chatModel = require("../../api/models/chatModel");
const messageModel = require("../../api/models/messageModel");
const notificationsModel = require("../../api/models/notificationsModel");
const {
  CAN_NOT_SEND_MESSAGE_IN_THIS_ROOM,
  MESSAGE_IS_TOO_LONG,
} = require("../../utils/errorMessages");

const sendMessageServices = async (socket, messageData) => {
  const {
    chatId,
    senderId,
    content,
    attachments = [],
    status = "sent",
  } = messageData;

  console.log(messageData, socket.rooms);

  if (typeof messageData === "string") {
    try {
      messageData = JSON.parse(messageData);
    } catch (err) {
      console.error("Error parsing messageData as JSON:", err.message);
      return {
        success: false,
        message: "Invalid JSON format for chat message.",
      };
    }
  }
  // Validate message length
  if (messageData.content.length > 500) {
    return {
      success: false,
      message: MESSAGE_IS_TOO_LONG,
    };
  }
  // Check if the user is in the room
  const isInRoom = Array.from(socket.rooms).some(
    (room) => room.toString() === chatId
  );
  if (!isInRoom) {
    console.log("Access denied. Cannot send message to this room.");
    return {
      success: false,
      message: CAN_NOT_SEND_MESSAGE_IN_THIS_ROOM,
    };
  }
  const savedMessage = await messageModel.create({
    chatId,
    senderId,
    content,
    attachments,
    status,
    timestamp: new Date(),
  });

  console.log("Message saved successfully:", savedMessage);
  // Emit the saved message back to the room
  socket.to(chatId).emit("message", savedMessage);

  const chat = await chatModel.findById(chatId).populate("participants");
  chat.participants.forEach(async (participant) => {
    const notification = await notificationsModel.create({
      userId: participant._id,
      message: `New message from ${senderId}`,
      type: "info",
      status: "unread",
    });
    console.log(`sent notification ${notification}`);

    socket.to(participant._id.toString()).emit("newNotification", notification);
  });

  return {
    success: true,
    message: savedMessage,
  };
};

module.exports = { sendMessageServices };
