const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

const getChatHistory = async (req, res) => {
  try {
    const { appId } = req.params;
    console.log("req.params.id", appId);
    const chatFound = await chatModel.findOne({ application: appId });
    // .populate("Application");
    //   .populate("seeker")
    //   .populate("employer");

    if (!chatFound) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.status(200).json({
      data: chatFound,
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      message: "Internal server error when getting messages",
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

module.exports = {
  getChatHistory,
  getAllUsers,
};

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const Chat = require("../models/chatModel");

// Create a new chat message
exports.createChat = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all chat messages
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update chat by ID
exports.updateChat = async (req, res) => {
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
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
