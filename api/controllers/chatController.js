const chatModel = require("../models/chatModel");

const createChat = async (req, res) => {
  try {
    const { chatType, participants, groupName, groupAdmin } = req.body;

    // Validate participants
    if (
      (chatType === "private" && participants.length !== 2) ||
      (chatType === "group" && participants.length < 2)
    ) {
      return res.status(400).json({
        success: false,
        message:
          chatType === "private"
            ? "Private chats must have exactly two participants."
            : "Group chats must have at least two participants.",
      });
    }

    // Check for unique participants in private chats
    if (chatType === "private" && participants[0] === participants[1]) {
      return res.status(400).json({
        success: false,
        message: "Participants in a private chat must be unique.",
      });
    }

    // Create the new chat
    const newChat = new chatModel({
      chatType,
      participants,
      ...(chatType === "group" && { groupName, groupAdmin }),
    });

    await newChat.save();

    res.status(201).json({
      success: true,
      data: newChat,
      message: "Chat created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat.",
      error: error.message,
    });
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
