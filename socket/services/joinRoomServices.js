const chatModel = require("../../api/models/chatModel");
const chatParticipantModel = require("../../api/models/chatParticipantModel");
const { ONLY_ADMIN_CAN_CREATE_GROUP } = require("../../utils/errorMessages");

const joinRoomServices = (
  socket,
  userId,
  chatType,
  groupName,
  participantIds
) => {
  const { user } = socket;
  // console.log("roomId", user);

  if (chatType === "private") {
    const chat = createOrGetPrivateChat(user.id, userId);
    return chat;
  }

  if (chatType === "group") {
    if (user.role !== "admin") {
      console.log("Only admins can create group chats");
      socket.emit("error", ONLY_ADMIN_CAN_CREATE_GROUP);
      return;
    }

    const chat = createOrGetGroupChat(groupName, creatorId, participantIds);
    return chat;
  }
};

// Create a new chat
const createOrGetPrivateChat = async (userId1, userId2) => {
  const chat = await chatModel.findOne({
    chatType: "private",
    participants: { $all: [userId1, userId2] },
  });

  if (!chat) {
    console.log("Chat not found. Creating a new chat...");

    const newChat = new chatModel({
      chatType: "private",
      participants: [userId1, userId2],
    });
    await newChat.save();

    await chatParticipantModel.create([
      {
        chatId: newChat._id,
        userId: userId1,
        role: "member",
        joinedAt: Date.now(),
      },
      {
        chatId: chat._id,
        userId: userId2,
        role: "member",
        joinedAt: Date.now(),
      },
    ]);
    console.log("New chat created.");
    return newChat;
  }
  console.log("chat found");

  return chat;
};

const createOrGetGroupChat = async (groupName, creatorId, participantIds) => {
  const chat = await chatModel.findOne({
    chatType: "group",
    groupName,
  });

  if (!chat) {
    console.log("Group chat not found. Creating a new group chat...");

    const newChat = new chatModel({
      chatType: "group",
      groupName: groupName,
      groupAdmin: creatorId,
      participants: participantIds,
    });
    await newChat.save();

    await chatParticipantModel.create(
      participantIds.map((userId) => ({
        chatId: newChat._id,
        userId: userId._id,
        role: "member",
        joinedAt: Date.now(),
      }))
    );
    console.log("New chat created.");
    return newChat;
  }
  console.log("chat found");

  return chat;
};

module.exports = {
  joinRoomServices,
};
