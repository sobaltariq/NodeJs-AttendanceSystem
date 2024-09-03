const mongoose = require("mongoose");
const {
  USER_NOT_FOUND,
  EMAIL_ALREADY_EXISTS,
  EMAIL_NOT_FOUND,
  INVALID_PASSWORD,
  ALREADY_LOGGED_IN,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTRATION_SUCCESS,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  UNAUTHORIZED,
  USER_DELETED_SUCCESSFULLY,
  INVALID_ID_FORMAT,
  USER_UPDATED_SUCCESSFULLY,
  NO_FIELDS_TO_UPDATE,
  UPDATED_PROFILE_PICTURE_SUCCESSFULLYl,
  PASSWORD_CHANGED_SUCCESSFULLY,
} = require("../../utils/errorMessages");
const userModel = require("../models/userModel");
const {
  uploadImageToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinaryImages");
const { generateToken } = require("../../utils/jwtTokenUtils");
const pendingProfileUpdateModel = require("../models/pendingProfileUpdateModel");

// ############## Start here ##############
// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const profilePicture = req.file;

    const email = req.body.email.toLowerCase();

    // Check if the email is already registered
    const alreadyExist = await userModel.findOne({ email });
    if (alreadyExist) {
      return res.status(400).json({
        error: EMAIL_ALREADY_EXISTS,
      });
    }

    // Upload profile picture
    const profilePictureUrl = await uploadImageToCloudinary(
      profilePicture.buffer
    );

    console.log("profilePicture", profilePicture);

    // Create a new user document
    const user = new userModel({
      name,
      email,
      password,
      role,
      profilePicture: profilePictureUrl,
    });

    // Save the user to the database
    await user.save();

    const token = generateToken({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });

    console.log(token);

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // or 'Lax' based on your needs
      maxAge: 120 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: REGISTRATION_SUCCESS,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ err: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    // to check if already logged in
    const tokenFromCookies = req.cookies["token"];
    if (tokenFromCookies) {
      return res.status(200).json({
        message: ALREADY_LOGGED_IN,
      });
    }

    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: EMAIL_NOT_FOUND });
    }

    // Check if the password is correct
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ error: INVALID_PASSWORD });
    }
    const token = generateToken({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });

    // console.log(token, user.toJSON());

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // or 'Lax' based on your needs
      maxAge: 120 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: LOGIN_SUCCESS,
      user: user.toJSON(), // to hide password
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message || INTERNAL_SERVER_ERROR });
  }
};

// logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: LOGOUT_SUCCESS });
  } catch (err) {
    res.status(500).json({ error: err.message || INTERNAL_SERVER_ERROR });
  }
};

// Get profile route (authenticated user)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || INTERNAL_SERVER_ERROR });
  }
};

// Get user by ID route (admin)
const getUserByIdForAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.role == "admin") {
      return res.status(403).json({ error: UNAUTHORIZED || FORBIDDEN });
    }

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Update user profile route (authenticated user)
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profilePicture = req.file;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    // Extract the public ID from the URL to delete the image from Cloudinary
    const publicId = user.profilePicture.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);

    // Upload profile picture
    const profilePictureUrl = await uploadImageToCloudinary(
      profilePicture.buffer
    );

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { profilePicture: profilePictureUrl },
        { new: true }
      )
      .select("-password -__v");

    return res.status(200).json({
      message: UPDATED_PROFILE_PICTURE_SUCCESSFULLYl,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Delete a user by ID
const adminDeleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: INVALID_ID_FORMAT });
    }
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    // Extract public ID from profile picture URL
    if (user.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      console.log(publicId);

      // Delete the profile picture from Cloudinary
      await deleteFromCloudinary(publicId);
    }
    await userModel.findByIdAndDelete(userId);
    res.json({
      message: USER_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

// Update a user by ID
const adminUpdateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: NO_FIELDS_TO_UPDATE });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: INVALID_ID_FORMAT,
      });
    }
    // Check if the user exists
    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "-password -__v",
    });
    if (!updatedUser) {
      return res.status(404).json({ error: USER_NOT_FOUND });
    }

    res.status(200).json({
      message: USER_UPDATED_SUCCESSFULLY,
      updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};
// $$$$$$$$$$$$$$$

// Get all users
const adminGetAllUsers = async (req, res) => {
  try {
    // Get page and limit from query parameters, default to page 1 and 5 items per page
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Calculate the skip value
    const skip = (currentPage - 1) * limit;

    // Find all users with pagination
    const users = await userModel
      .find()
      .skip(skip)
      .limit(limit)
      .select("-password -jobTitle");

    // Get the total count of users
    const totalUsers = await userModel.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage,
      totalPages,
      totalUsers,
    });

    // const usersFound = await userModel.find().select("-password -jobTitle");
  } catch (error) {
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { id } = req.params;

    const user = await userModel.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: USER_NOT_FOUND });
    }

    // Check if the password is correct
    const passwordMatch = await user.comparePassword(oldPassword);
    if (!passwordMatch) {
      return res.status(401).json({ error: INVALID_PASSWORD });
    }

    // Hash the new password
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: PASSWORD_CHANGED_SUCCESSFULLY });
  } catch (error) {
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserByIdForAdmin,
  adminUpdateUserById,
  adminDeleteUserById,
  updateUserProfile,
  adminGetAllUsers,
  changePassword,
};
