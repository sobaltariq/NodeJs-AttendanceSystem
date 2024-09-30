const chatModel = require("../../api/models/chatModel");
const chatParticipantModel = require("../../api/models/chatParticipantModel");

const chatServices = {
  // Create a new chat
  async createChat(chatData) {
    const chat = new chatModel(chatData);
    await chat.save();
    return chat; // Return the chat object after saving
  },

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
module.exports = chatService;
