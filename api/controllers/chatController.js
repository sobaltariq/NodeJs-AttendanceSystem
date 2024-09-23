const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

const createChat = async (req, res) => {
  const { participants, chatType, groupName, groupAdmin } = req.body;

  try {
    const newChat = new chatModel({
      chatType,
      groupName,
      participants: {
        userId: participants,
      },
      groupAdmin,
    });

    await newChat.save();
    return res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    console.log("chatId", chatId, "userId", userId);

    const chatHistory = await chatModel.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });

    if (!chatHistory) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.status(200).json({
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

const getAllUsers = async (req, res, next) => {
  try {
    const { myId } = req.params;
    const usersFound = await userModel.findById(myId);
    if (!usersFound) {
      return res.status(404).json({
        message: "get user not found",
        email: req.user.email,
      });
    }
    const formattedUsers = {
      userId: usersFound._id,
      userRole: usersFound.role,
      userName: usersFound.name,
      userEmail: usersFound.email,
    };
    return res.status(200).json({
      message: "get user",
      data: formattedUsers,
      // data: usersFound,
    });
  } catch (err) {
    console.log(err.message);
    res.status(501).json({
      error: "Internal server error when getting all users",
    });
  }
};

// Update chat by ID
const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete chat by ID
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  getChatHistory,
  getAllUsers,
  updateChat,
  deleteChat,
};
