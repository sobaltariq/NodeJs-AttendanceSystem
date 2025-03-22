const chatModel = require("../../api/models/chatModel");
const chatParticipantModel = require("../../api/models/chatParticipantModel");
const {
  ONLY_ADMIN_CAN_CREATE_GROUP,
  GROUP_NAME_TAKEN_BY_ANOTHER_ADMIN,
  PRIVATE_CHAT_CREATED,
  PRIVATE_CHAT_ALREADY_EXIST,
  GROUP_CHAT_CREATED,
  GROUP_CHAT_ALREADY_EXIST,
} = require("../../utils/errorMessages");

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
      return { success: false, message: ONLY_ADMIN_CAN_CREATE_GROUP };
    }

    const chat = createOrGetGroupChat(user, groupName, participantIds, socket);
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
      groupName: `private_${Date.now()}`,
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
        chatId: newChat._id,
        userId: userId2,
        role: "member",
        joinedAt: Date.now(),
      },
    ]);
    console.log("New chat created.");

    return { success: true, _id: newChat._id, message: PRIVATE_CHAT_CREATED };
  }
  console.log("chat found");

  return { success: true, _id: chat._id, message: PRIVATE_CHAT_ALREADY_EXIST };
};

const createOrGetGroupChat = async (
  user,
  groupName,
  participantIds,
  socket
) => {
  const chat = await chatModel.findOne({
    chatType: "group",
    groupName,
  });

  if (!chat) {
    console.log("Group chat not found. Creating a new group chat...");

    const newChat = new chatModel({
      chatType: "group",
      groupName,
      groupAdmin: user.id,
      participants: participantIds,
    });
    await newChat.save();

    const newParticipant = participantIds.map((userId) => ({
      chatId: newChat._id,
      userId: userId,
      role: "member",
      joinedAt: Date.now(),
    }));
    await chatParticipantModel.create(newParticipant);

    console.log("New chat created.");
    return { success: true, _id: newChat._id, message: GROUP_CHAT_CREATED };
  }
  if (chat.groupAdmin.toString() !== user.id) {
    console.log(
      "Group name is taken by another admin.",
      chat.groupAdmin,
      user.id
    );
    socket.emit("error", GROUP_NAME_TAKEN_BY_ANOTHER_ADMIN);
    return { success: false, message: GROUP_NAME_TAKEN_BY_ANOTHER_ADMIN };
  }

  console.log("Group chat found, returning existing chat.");
  return { success: true, _id: chat._id, message: GROUP_CHAT_ALREADY_EXIST };
};

module.exports = {
  joinRoomServices,
};
