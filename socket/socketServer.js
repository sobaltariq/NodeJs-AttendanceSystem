const { Server } = require("socket.io");
const {
  verifyWSLoginToken,
} = require("../middleware/socket/verifyWSLoginToken");
const { joinRoomServices } = require("./event/joinRoomServices");
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
        joinRoomServices(socket, userId, chatType, groupName, participantIds);
      } catch (err) {
        console.error("Error handling joinRoom:", err.message);
        socket.emit("error", INTERNAL_SERVER_ERROR_WHEN_JOINING_ROOM);
      }
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
