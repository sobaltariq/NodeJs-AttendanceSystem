// cron/resetMonthlyPoints.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const userModel = require("../../api/models/userModel");
const employeeOfTheMonthModel = require("../../api/models/employeeOfTheMonthModel");

// Schedule the job to run at midnight on the first day of every month
// cron.schedule("* * * * * *", async () => {
cron.schedule("0 0 1 * *", async () => {
  // cron.schedule("*/10 * * * * *", async () => {
  console.log("Setting monthly points...");
  try {
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1; // 0 = January, 11 = December
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(); // If January, reduce the year by 1

    const month = new Date(year, previousMonth).toLocaleString("en-US", { month: "long" }).toLowerCase(); // e.g., 'september'

    // Find the user with the highest monthlyPoints
    const topEmployee = await userModel
      .findOne()
      .sort({ monthlyPoints: -1 })
      .select("_id name username monthlyPoints");

    if (topEmployee) {
      // Create or update the Employee of the Month entry
      await employeeOfTheMonthModel.findOneAndUpdate(
        { month, year },
        {
          employeeId: topEmployee._id,
          username: topEmployee.username,
          reason: "Top performer with highest monthly points.",
          awardedAt: now,
        },
        { upsert: true, new: true }
      );

      console.log(`Employee of the Month for ${month} ${year}: ${topEmployee} with ${topEmployee.monthlyPoints} points.`);
    } else {
      console.log("No users found to award Employee of the Month.");
    }

    // Reset the monthly points for all users
    // await userModel.updateMany({}, { monthlyPoints: 0 });
    console.log("Monthly points reset successfully.", month, year);
  } catch (error) {
    console.error("Error resetting monthly points:", error);
  }
});
