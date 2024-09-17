const {
  NOTICE_NOT_FOUND,
  NOTICE_DELETED_SUCCESSFULLY,
  INTERNAL_SERVER_ERROR,
  NOTICE_CREATED_SUCCESSFULLY,
} = require("../../utils/errorMessages");
const noticeBoardModel = require("../models/noticeBoardModel");

// Create a new notice
const createNotice = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const userId = req.user.id;
    console.log(req.body, userId);
    await noticeBoardModel.create({
      title,
      content,
      type,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: NOTICE_CREATED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const notices = await noticeBoardModel
      .find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

// Update a notice by ID
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a notice by ID
const deleteNotice = async (req, res) => {
  try {
    const notice = await noticeBoardModel.findByIdAndDelete(req.params.id);
    if (!notice)
      return res.status(404).json({
        success: false,
        error: NOTICE_NOT_FOUND,
      });
    res.status(200).json({
      success: true,
      message: NOTICE_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
};
