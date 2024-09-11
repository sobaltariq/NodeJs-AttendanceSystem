const cron = require("node-cron");
const mongoose = require("mongoose");
const userModel = require("../../api/models/userModel");

// Schedule the job to run at midnight on the 1st of every month
// cron.schedule('* * * * * *', async () => {
cron.schedule("0 0 1 * *", async () => {
  console.log("Resetting paid leaves count...");
  try {
    await userModel.updateMany(
      {}, // Select all users
      {
        $set: {
          paidLeavesTaken: 0, // Set to next January 1st
        },
      }
    );
    console.log("Paid leaves count reset successfully.");
  } catch (error) {
    console.error("Error resetting paid leaves count:", error);
  }
});
