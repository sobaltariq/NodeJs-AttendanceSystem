const {
  FEEDBACK_ALREADY_SUBMITTED,
  FEEDBACK_CREATED_SUCCESSFULLY,
  INTERNAL_SERVER_ERROR,
  FEEDBACK_UPDATED_SUCCESSFULLY,
  INVALID_STATUS,
  FEEDBACK_NOT_FOUND,
  FEEDBACK_ALREADY_UPDATED,
  FEEDBACK_DELETED_SUCCESSFULLY,
} = require("../../utils/errorMessages");
const feedbackModel = require("../models/feedbackModel");

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    user = req.user.id;
    const { feedbackType, message, screenshot } = req.body;

    // Check if feedback already exists
    const existingFeedback = await feedbackModel.findOne({
      user,
      status: { $in: ["New", "In Progress"] },
    });
    if (existingFeedback) {
      return res.status(400).json({
        status: false,
        message: FEEDBACK_ALREADY_SUBMITTED,
        feedback: existingFeedback,
      });
    }

    const feedback = new feedbackModel({
      user,
      feedbackType,
      message,
      screenshot,
    });

    await feedback.save();
    res.status(201).json({
      success: true,
      message: FEEDBACK_CREATED_SUCCESSFULLY,
      feedback: feedback._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Get all feedback
const getAllAndOneFeedback = async (req, res) => {
  try {
    const { user, status, feedbackType } = req.query;

    const query = {};
    if (user) query.user = user;
    if (status) query.status = status;
    if (feedbackType) query.feedbackType = feedbackType;

    const feedbacks = await feedbackModel.find(query).populate("user");

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: INVALID_STATUS,
      });
    }

    const feedback = await feedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: FEEDBACK_NOT_FOUND,
      });
    }

    if (feedback.status === status) {
      return res.status(400).json({
        success: false,
        error: `${FEEDBACK_ALREADY_UPDATED} to ${status}`,
      });
    }

    const updatedFeedback = await feedbackModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: FEEDBACK_UPDATED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: FEEDBACK_NOT_FOUND,
      });
    }
    await feedbackModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: FEEDBACK_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  createFeedback,
  getAllAndOneFeedback,
  updateFeedback,
  deleteFeedback,
};
