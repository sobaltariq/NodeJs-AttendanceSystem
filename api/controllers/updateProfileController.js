const {
  REQUEST_ALREADY_PENDING,
  NO_FIELDS_TO_UPDATE,
  UPDATE_REQUEST_SENT_SUCCESSFULLY,
  INTERNAL_SERVER_ERROR,
  REQUEST_NOT_FOUND,
  REQUEST_ALREADY_APPROVED_OR_REJECTED,
  INVALID_PROFILE_UPDATE_STATUS,
  REQUEST_REVIEWED_SUCCESSFULLY,
  USER_NOT_FOUND,
} = require("../../utils/errorMessages");
const pendingProfileUpdateModel = require("../models/pendingProfileUpdateModel");
const userModel = require("../models/userModel");

const requestSensitiveFieldUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      bankName,
      ibanNumber,
      whatsApp,
      accountNumber,
      address,
    } = req.body;

    const updateRequest = {
      name,
      email,
      bankName,
      ibanNumber,
      whatsApp,
      accountNumber,
      address,
    };

    // Check if the user already has a pending request
    const existingRequest = await pendingProfileUpdateModel.findOne({
      user: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ error: REQUEST_ALREADY_PENDING });
    }

    // Remove fields that are not present in the request
    Object.keys(updateRequest).forEach((key) => {
      if (updateRequest[key] === undefined || updateRequest[key] === "") {
        delete updateRequest[key];
      }
    });

    if (Object.keys(updateRequest).length === 0) {
      return res.status(400).json({ error: NO_FIELDS_TO_UPDATE });
    }
    console.log(updateRequest);

    //  Update user document
    const newRequest = await pendingProfileUpdateModel.create({
      user: userId,
      updateRequest,
    });

    // Update the user with the new request ID
    await userModel.findByIdAndUpdate(userId, {
      pendingUpdate: newRequest._id,
    });

    return res.status(201).json({
      message: UPDATE_REQUEST_SENT_SUCCESSFULLY,
      request: newRequest,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

const adminReviewUpdateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.user.id;
    const { status } = req.body;

    console.log(requestId, adminId, status);

    // Validate the status input
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: INVALID_PROFILE_UPDATE_STATUS });
    }

    // Check if the request exists
    const request = await pendingProfileUpdateModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: REQUEST_NOT_FOUND });
    }

    const userFound = await userModel.findById(request.user);
    if (!userFound) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }
    // Check if the request has already been reviewed
    if (request.status !== "pending") {
      return res.status(400).json({
        error: `${REQUEST_ALREADY_APPROVED_OR_REJECTED} ${status} ${request.status}`,
      });
    }

    // Apply changes to user profile if the request is approved
    if (status === "approved") {
      // Apply changes from the update request
      const updateRequestObject = Object.fromEntries(request.updateRequest);

      Object.keys(updateRequestObject).forEach((key) => {
        if (userFound[key] !== undefined) {
          userFound[key] = updateRequestObject[key];
        }
      });

      await userFound.save();
    }

    // Update the request status, set reviewedBy, and reviewedAt
    request.status = status;
    request.reviewedBy = adminId;
    request.reviewedAt = new Date();

    await request.save();
    res
      .status(200)
      .json({ message: REQUEST_REVIEWED_SUCCESSFULLY, request, userFound });
  } catch (error) {
    res.status(400).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  requestSensitiveFieldUpdate,
  adminReviewUpdateRequest,
};
