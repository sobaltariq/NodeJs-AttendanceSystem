const {
  EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  EMPLOYEE_OF_THE_MONTH_CREATED_SUCCESSFULLY,
  EMPLOYEE_OF_THE_MONTH_ALREADY_EXIST,
  EMPLOYEE_OF_THE_MONTH_UPDATED_SUCCESSFULLY,
  NO_FIELDS_TO_UPDATE,
  USER_NOT_FOUND,
} = require("../../utils/errorMessages");
const employeeOfTheMonthModel = require("../models/employeeOfTheMonthModel");
const userModel = require("../models/userModel");

const getCurrentEmployeeOfTheMonth = async (req, res) => {
  try {
    const employeeOfTheMonth = await employeeOfTheMonthModel
      .findOne({})
      .populate("employeeId", "name username monthlyPoints")
      .sort({ awardedAt: -1 });

    if (!employeeOfTheMonth) {
      return res.status(404).json({
        success: false,
        message: EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
      });
    }
    res.status(200).json({
      success: true,
      data: employeeOfTheMonth,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const setEmployeeOfTheMonth = async (req, res) => {
  try {
    const { username, year, reason } = req.body;
    const month = req.body.month.toLowerCase();

    console.log(req.body);
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const employeeOfTheMonth = await employeeOfTheMonthModel.findOne({
      month,
      year,
    });
    if (employeeOfTheMonth) {
      return res.status(400).json({
        success: false,
        message: EMPLOYEE_OF_THE_MONTH_ALREADY_EXIST,
      });
    }

    await employeeOfTheMonthModel.create({
      employeeId: user._id,
      username,
      month,
      year,
      reason,
    });

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
    const { username, month, year, reason } = req.body;
    const id = req.params.id;

    // Check if any fields are provided for update
    if (!username && !month && !year && !reason) {
      return res.status(400).json({
        success: false,
        message: NO_FIELDS_TO_UPDATE,
      });
    }

    let newUser;
    if (username) {
      newUser = await userModel.findOne({ username });
      if (!newUser) {
        return res.status(404).json({
          success: false,
          message: USER_NOT_FOUND,
        });
      }
    }

    // Find existing Employee of the Month
    const eotm = await employeeOfTheMonthModel.findById(id);
    if (!eotm) {
      return res.status(404).json({
        success: false,
        message: EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
      });
    }

    // Decrement the employeeOfTheMonthCount for the previous employee if changing the username
    if (username && eotm.employeeId.toString() !== newUser._id.toString()) {
      await userModel.findByIdAndUpdate(
        eotm.employeeId,
        { $inc: { employeeOfTheMonthCount: -1 } },
        { new: true }
      );
    }

    // Update Employee of the Month entry with new data
    const updatedEotm = await employeeOfTheMonthModel.findByIdAndUpdate(
      id,
      {
        employeeId: newUser ? newUser._id : eotm.employeeId,
        month,
        year,
        reason,
      },
      { new: true, runValidators: true }
    );

    // Increment the employeeOfTheMonthCount for the new user
    if (newUser) {
      await userModel.findByIdAndUpdate(
        newUser._id,
        { $inc: { employeeOfTheMonthCount: 1 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: EMPLOYEE_OF_THE_MONTH_UPDATED_SUCCESSFULLY,
      data: updatedEotm,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Get all employee of the month records
const getEmployeeOfTheMonthHistory = async (req, res) => {
  try {
    const eotm = await employeeOfTheMonthModel.find().populate("employeeId", "name username monthlyPoints").sort({ awardedAt: -1 });
    res.status(200).json({
      success: true,
      data: eotm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const getAllEmployeesByPoints = async (req, res) => {
  try {
    // Get the current month and year
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" }).toLowerCase(); // Current month (1 to 12)
    const currentYear = new Date().getFullYear(); // Current year

    // Find all employees with monthlyPoints greater than 0, sorted by points descending
    const employees = await employeeOfTheMonthModel.find({
      month: currentMonth,
      year: currentYear,
    }).populate("employeeId", "name username monthlyPoints");

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        success: false,
        currentMonth,
        message: EMPLOYEE_OF_THE_MONTH_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }

}

module.exports = {
  getCurrentEmployeeOfTheMonth,
  updateEmployeeOfTheMonth,
  setEmployeeOfTheMonth,
  getEmployeeOfTheMonthHistory,
  getAllEmployeesByPoints
};
