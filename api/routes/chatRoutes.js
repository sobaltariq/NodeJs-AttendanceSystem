const express = require("express");
const {
  getChatHistory,
  getParticipants,
} = require("../controllers/chatController");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");

// Chat routes
const router = express.Router();

router.get("/:chatId", verifyLoginToken, getChatHistory);
router.get("/participants/:chatId", verifyLoginToken, getParticipants);

module.exports = router;
