const { Server } = require("socket.io");
const {
  verifyWSLoginToken,
} = require("../middleware/socket/verifyWSLoginToken");
const { joinRoomServices } = require("./services/joinRoomServices");
const {
  INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM,
} = require("../utils/errorMessages");
const { joinRoomHandler } = require("./handler/joinRoomHandler");

const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust according to your needs
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  // Use the verifyWSToken middleware for WebSocket connections
  io.use(verifyWSLoginToken);

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Join a specific chat room when a user wants to join a chat
    socket.on("joinRoom", async (data) => joinRoomHandler(socket, data));

    // Event for sending a message
    socket.on("sendMessage", async ({ chatId, message }) => {
      try {
        const savedMessage = await chatService.saveMessage(
          chatId,
          socket.user.id,
          message
        );
        io.to(chatId).emit("messageReceived", {
          chatId,
          message: savedMessage,
        });
      } catch (error) {
        socket.emit("error", "Error sending message.");
      }
    });

    // Typing indicator
    socket.on("typing", ({ chatId }) => {
      socket.to(chatId).emit("typing", { userId: socket.user.id });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(chatId).emit("stopTyping", { userId: socket.user.id });
    });

    socket.on("error", (message) => {
      console.error(`Error: ${message}`);
    });

    socket.on("message", (message) => {
      console.error(`Error: ${message}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocketServer;
