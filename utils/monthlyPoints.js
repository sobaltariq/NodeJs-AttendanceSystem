// utils/pointsCalculator.js
const userModel = require("../api/models/userModel");

// Calculate points based on attendance status
function calculatePoints(status) {
  switch (status) {
    case "present":
      return 1;
    case "absent":
      return -5;
    case "late":
      return -1;
    case "early":
      return 1;
    case "leave":
      return -1;
    default:
      return 0;
  }
}

// Reset monthly points for all users
async function resetMonthlyPoints() {
  await userModel.updateMany({}, { $set: { monthlyPoints: 0 } });
}

// Update Employee of the Month based on monthly points
async function updateEmployeeOfTheMonth() {
  // Find the user with the highest points
  const topUser = await userModel.findOne().sort({ monthlyPoints: -1 }).exec();

  if (topUser) {
    const newAward = new EmployerOfTheMonth({
      employeeId: topUser._id,
      month: new Date().toLocaleString("default", { month: "long" }),
      year: new Date().getFullYear(),
      reason: "Highest monthly points",
    });

    await newAward.save();
  }
}

module.exports = {
  calculatePoints,
  resetMonthlyPoints,
  updateEmployeeOfTheMonth,
};
