const chatModel = require("../../../api/models/chatModel");
const chatParticipantModel = require("../../../api/models/chatParticipantModel");

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

const chatServices = {
  // Add a participant to a chat
  async addParticipant(chatId, userId) {
    const participant = new chatParticipantModel({ chatId, userId });
    try {
      await participant.save();
      return participant;
    } catch (error) {
      throw new Error("Participant already exists or other error occurred.");
    }
  },

  // Add participants to a chat
  async addParticipants(chatId, userIds) {
    try {
      const participants = await Promise.all(
        userIds.map(async (userId) => {
          const participant = new chatParticipantModel({
            chatId,
            userId,
          });
          return await participant.save();
        })
      );
      return participants; // Return saved participants
    } catch (error) {
      throw new Error("Error adding participants.");
    }
  },

  // Fetch messages for a given chat
  async getMessages(chatId) {
    try {
      const messages = await Message.find({ chatId }).populate(
        "sender",
        "username"
      );
      return messages;
    } catch (error) {
      throw new Error("Error fetching messages.");
    }
  },

  // Save a new message to the database
  async saveMessage(chatId, sender, content, attachments) {
    const message = new Message({ chatId, sender, content, attachments });
    try {
      return await message.save();
    } catch (error) {
      throw new Error("Error saving message.");
    }
  },

  // Update message status
  async updateMessageStatus(messageId, status) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      throw new Error("Error updating message status.");
    }
  },
};

module.exports = { createOrGetPrivateChat, createOrGetGroupChat };
