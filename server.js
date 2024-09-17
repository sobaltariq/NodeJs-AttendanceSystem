const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db/mongoDb");
const http = require("http");
const initializeSocketServer = require("./socket/socketServer");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");

// for env
require("dotenv").config();

const app = express();

// db connection
connectDB();

// Disable 'X-Powered-By' header
app.disable("x-powered-by");

// Enabling CORS
app.use(cors(corsOptions));
app.use(cookieParser());
// for json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and load the cron jobs
require("./utils/tasks/resetPaidLeaves");
require("./utils/tasks/resetMonthlyPoints");
require("./utils/tasks/markAbsent");
// const task = require("./utils/tasks/test");

// Import routes
const userRoutes = require("./api/routes/userRoutes");
const profileRoutes = require("./api/routes/profileUpdateRoutes");
const attendanceRoutes = require("./api/routes/attendanceRoutes");
const leaveRequestRoutes = require("./api/routes/leaveRequestRoutes");
// const notificationRoutes = require("./api/routes/notificationRoutes");
const noticeBoardRoutes = require("./api/routes/noticeBoardRoutes");
const employeeOfTheMonthRoutes = require("./api/routes/employeeOfTheMonthRoutes");
const feedbackRoutes = require("./api/routes/feedbackRoutes");
const chatRoutes = require("./api/routes/chatRoutes");

// use routes
app.get("/", (req, res) => {
  let myIp = req.ip?.replace(/^.*:/, "");
  res.status(200).json({
    message: "Attendance System Home Page",
    port: `http://${myIp}:${process.env.PORT}`,
  });
});

app.use("/users", userRoutes);
app.use("/profile", profileRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/leave-requests", leaveRequestRoutes);
// app.use("/notifications", notificationRoutes);
app.use("/notice-board", noticeBoardRoutes);
app.use("/employee-of-the-month", employeeOfTheMonthRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/chats", chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Page Not Found!",
    error: "404",
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
initializeSocketServer(server);

server.listen(process.env.PORT, () => {
  console.log(`Server started with WebSocket on port ${process.env.PORT}`);
});
