const { createOrGetPrivateChat } = require("../chatService");

const joinRoomServices = (socket, userId, chatType) => {
  const { user } = socket;
  //   console.log("roomId", user);

  if (chatType === "private") {
    const chat = createOrGetPrivateChat(user.id, userId);
  }
};

module.exports = {
  joinRoomServices,
};
