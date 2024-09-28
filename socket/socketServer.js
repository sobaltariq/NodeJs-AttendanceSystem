const { Server } = require("socket.io");
const {
  verifyWSLoginToken,
} = require("../middleware/socket/verifyWSLoginToken");

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

    socket.on("error", (message) => {
      console.error(`Error: ${message}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocketServer;
