const { ONLY_ADMIN_CAN_CREATE_GROUP } = require("../../utils/errorMessages");
const {
  createOrGetPrivateChat,
  createOrGetGroupChat,
} = require("../services/chat/chatService");

const joinRoomServices = (
  socket,
  userId,
  chatType,
  groupName,
  participantIds
) => {
  const { user } = socket;
  console.log("roomId", user);

  if (chatType === "private") {
    const chat = createOrGetPrivateChat(user.id, userId);
    socket.join(chat.id);
  }

  if (user.role !== "admin") {
    console.log("Only admins can create group chats");
    socket.emit("error", ONLY_ADMIN_CAN_CREATE_GROUP);
    return;
  }

  if (chatType === "group") {
    const chat = createOrGetGroupChat(groupName, creatorId, participantIds);
    socket.join(chat.id);
  }
};

module.exports = {
  joinRoomServices,
};
