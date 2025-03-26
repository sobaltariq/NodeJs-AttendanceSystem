const chatModel = require("../../api/models/chatModel");
const { INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM } = require("../../utils/errorMessages");
const { joinRoomServices } = require("../services/joinRoomServices");

const joinRoomHandler = async (
  socket,
  { userId, chatType, groupName, participantIds }
) => {
  try {
    // console.log("roomId", userId, chatType, groupName, participantIds);
    if (!userId || !chatType) {
      socket.emit("error", { success: false, message: "userId and chatType are required." });
      return;
    }

    if (chatType === "group") {
      if (
        !groupName ||
        !Array.isArray(participantIds) ||
        participantIds.length === 0
      ) {
        socket.emit(
          "error",
          "For group chat, groupName and participantIds are required."
        );
        return;
      }
    }

    const chat = await joinRoomServices(
      socket,
      userId,
      chatType,
      chatType === "group" ? groupName : undefined,
      chatType === "group" ? participantIds : undefined
    );

    if (chat.success) {
      console.log("joined room", chat._id);

      socket.join(chat._id.toString());
      if (chatType === "group") {
        const groupAdminDetails = await chatModel.findById(chat._id);
        socket.emit("roomJoined", {
          chatId: chat._id,
          chatType,
          message: chat.message,
          groupAdmin: groupAdminDetails.groupAdmin,
        });
      } else {
        // For private chat, only emit chatId and chatType
        socket.emit("roomJoined", {
          chatId: chat._id,
          chatType,
          message: chat.message,
        });
      }
      // console.log(`Client ${socket.id} joined room: ${chat._id} (${chatType})`);
    } else {
      socket.emit("error", { success: false, message: chat.message });
    }
  } catch (err) {
    console.error("Error handling joinRoom:", err.message);
    socket.emit("error", { success: false, message: INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM });
  }
};

module.exports = { joinRoomHandler };
