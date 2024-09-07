// cron/resetMonthlyPoints.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const userModel = require("../../api/models/userModel");

// Schedule the job to run at midnight on the first day of every month
// cron.schedule("* * * * * *", async () => {
cron.schedule("0 0 1 * *", async () => {
  console.log("Resetting monthly points...");
  try {
    // Reset the monthly points for all users
    await userModel.updateMany({}, { monthlyPoints: 0 });
    console.log("Monthly points reset successfully.");
  } catch (error) {
    console.error("Error resetting monthly points:", error);
  }
});
