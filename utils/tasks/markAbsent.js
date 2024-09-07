const cron = require("node-cron");
const mongoose = require("mongoose");
const userModel = require("../../api/models/userModel");
const attendanceModel = require("../../api/models/attendanceModel");

// Schedule the job to run at midnight every day
// cron.schedule("* * * * * *", async () => {
cron.schedule("0 0 * * *", async () => {
  console.log("Checking for users who missed punch-in...");

  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    // Find users who don't have an attendance record for today
    const users = await userModel.find();

    for (const user of users) {
      // Check if the user has an attendance record for today
      const existingAttendance = await attendanceModel.findOne({
        userId: user._id,
        todayDate: startOfToday,
      });

      if (!existingAttendance) {
        const newAttendance = await attendanceModel.create({
          userId: user._id,
          todayDate: startOfToday,
          status: "absent",
        });

        // Update user points and attendance history
        await userModel.findByIdAndUpdate(
          user._id,
          {
            $push: { attendanceHistory: newAttendance._id },
            $inc: { monthlyPoints: -5 },
          },
          {
            new: true,
          }
        );

        console.log(`Marked user ${user._id} as absent for today.`);
      }
    }
  } catch (error) {
    console.error("Error checking attendance:", error);
  }
});
