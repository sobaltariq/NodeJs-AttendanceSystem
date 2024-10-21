const { Server } = require("socket.io");
const {
  verifyWSLoginToken,
} = require("../middleware/socket/verifyWSLoginToken");
const { joinRoomServices } = require("./services/joinRoomServices");
const {
  INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM,
} = require("../utils/errorMessages");

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
    socket.on("joinRoom", async ({ userId, chatType }) => {
      try {
        console.log("roomId", userId, chatType);
        const chat = joinRoomServices(
          socket,
          userId,
          chatType,
          chatType === "group" ? groupName : undefined,
          chatType === "group" ? participantIds : undefined
        );
        socket.join(chat._id); // Join the chat room
        socket.emit("roomJoined", { chatId: chat._id, chatType }); // Emit to the client
        console.log(`Client ${socket.id} joined room: ${chat}`);
      } catch (err) {
        console.error("Error handling joinRoom:", err.message);
        socket.emit("error", INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM);
      }
    });

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

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocketServer;
