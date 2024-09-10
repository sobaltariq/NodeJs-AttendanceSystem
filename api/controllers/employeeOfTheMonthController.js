const {
  EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  EMPLOYEE_OF_THE_MONTH_CREATED_SUCCESSFULLY,
} = require("../../utils/errorMessages");
const employeeOfTheMonthModel = require("../models/employeeOfTheMonthModel");
const userModel = require("../models/userModel");

const getCurrentEmployeeOfTheMonth = async (req, res) => {
  try {
    const employeeOfTheMonth = await employeeOfTheMonthModel
      .findOne({})
      .populate("user")
      .sort({ date: -1 });

    if (!employeeOfTheMonth) {
      return res.status(404).json({
        success: false,
        message: EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const setEmployeeOfTheMonth = async (req, res) => {
  try {
    const { username, month, year, reason } = req.body;
    console.log(req.body);
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await employeeOfTheMonthModel.create({
      employeeId: user._id,
      username,
      month,
      year,
      reason,
    });
    await employeeOfTheMonthModel.save();

    res.status(201).json({
      success: true,
      message: EMPLOYEE_OF_THE_MONTH_CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Update an employee of the month record by ID
const updateEmployeeOfTheMonth = async (req, res) => {
  try {
    const eotm = await EmployeeOfTheMonth.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!eotm) return res.status(404).json({ error: "Record not found" });
    res.json(eotm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all employee of the month records
const getEmployeeOfTheMonthHistory = async (req, res) => {
  try {
    const eotm = await employeeOfTheMonthModel.find().sort({ date: -1 });
    res.status(200).json({
      employeeOfTheMonthHistory: eotm,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  getCurrentEmployeeOfTheMonth,
  updateEmployeeOfTheMonth,
  setEmployeeOfTheMonth,
  getEmployeeOfTheMonthHistory,
};
