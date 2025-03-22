const {
  INTERNAL_SERVER_ERROR,
  PARTICIPANTS_FOUND,
  CHAT_NOT_FOUND,
} = require("../../utils/errorMessages");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    console.log("chatId", chatId, "userId", userId);

    const chatFound = await chatModel.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });

    if (!chatFound) {
      return res.status(404).json({
        success: false,
        message: CHAT_NOT_FOUND,
      });
    }

    const chatHistory = await messageModel.find({ chatId });

    res.status(200).json({
      success: true,
      data: chatHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const getParticipants = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chatFound = await chatModel.findById(chatId);
    if (!chatFound) {
      return res.status(404).json({
        success: false,
        message: CHAT_NOT_FOUND,
      });
    }
    return res.status(200).json({
      success: true,
      message: PARTICIPANTS_FOUND,
      data: chatFound.participants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  getChatHistory,
  getParticipants,
};
