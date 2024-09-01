const EmployerOfTheMonth = require("../models/employerOfTheMonthModel");

// Create a new employer of the month record
exports.createEmployerOfTheMonth = async (req, res) => {
  try {
    const eotm = new EmployerOfTheMonth(req.body);
    await eotm.save();
    res.status(201).json(eotm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all employer of the month records
exports.getAllEmployersOfTheMonth = async (req, res) => {
  try {
    const eotmRecords = await EmployerOfTheMonth.find();
    res.json(eotmRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employer of the month record by ID
exports.getEmployerOfTheMonthById = async (req, res) => {
  try {
    const eotm = await EmployerOfTheMonth.findById(req.params.id);
    if (!eotm) return res.status(404).json({ error: "Record not found" });
    res.json(eotm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an employer of the month record by ID
exports.updateEmployerOfTheMonth = async (req, res) => {
  try {
    const eotm = await EmployerOfTheMonth.findByIdAndUpdate(
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

// Delete an employer of the month record by ID
exports.deleteEmployerOfTheMonth = async (req, res) => {
  try {
    const eotm = await EmployerOfTheMonth.findByIdAndDelete(req.params.id);
    if (!eotm) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
