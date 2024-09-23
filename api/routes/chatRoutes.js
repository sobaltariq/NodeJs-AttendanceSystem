const express = require("express");
const {
  createChat,
  getChatHistory,
  getAllUsers,
} = require("../controllers/chatController");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");

// Chat routes
const router = express.Router();

router.get("/:chatId", verifyLoginToken, getChatHistory);
router.get("/users/:myId", verifyLoginToken, getAllUsers);
router.patch("/create", createChat);

module.exports = router;
