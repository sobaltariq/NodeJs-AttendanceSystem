const feedbackModel = require("../models/feedbackModel");

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const feedback = new feedbackModel(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackModel.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackModel.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
};
