const express = require("express");
const chatController = require("../controllers/chatController");

// Chat routes
const router = express.Router();
router.post("/", chatController.createChat);
router.get("/", chatController.getAllChats);
router.get("/:id", chatController.getChatById);
router.put("/:id", chatController.updateChat);
router.delete("/:id", chatController.deleteChat);

module.exports = router;
