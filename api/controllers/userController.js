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
} = require("../../utils/errorMessages");
const userModel = require("../models/userModel");
const {
  uploadImageToCloudinary,
  deleteFromCloudinary,
} = require("../../middleware/express/cloudinaryMiddleware");
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
      message: UPDATED_PROFILE_PICTURE_SUCCESSFULLY,
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
      return res.status(400).json({ error: "Invalid ID format" });
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
    res.status(500).json({ error: error.message });
  }
};

// $$$$$$$$$$$$$$$
// Update a user by ID
const adminUpdateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const adminGetAllUsers = async (req, res) => {
  try {
    const usersFound = await userModel.find().select("-password -jobTitle");
    if (!usersFound) {
      return res.status(404).json({
        message: USER_NOT_FOUND,
        email: req.user.email,
      });
    }
    res.status(200).json({
      users: usersFound,
    });
  } catch (error) {
    // console.log(err.message);
    res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
  //  try {
  //    // Pagination parameters
  //    const page = parseInt(req.query.page, 10) || 1;
  //    const limit = parseInt(req.query.limit, 10) || 10;

  //    // Validate pagination parameters
  //    if (page < 1 || limit < 1) {
  //      return res.status(400).json({ message: errorMessages.BAD_REQUEST });
  //    }

  //    // Find users with pagination and excluding sensitive fields
  //    const users = await User.find()
  //      .skip((page - 1) * limit)
  //      .limit(limit)
  //      .select("-password -jobTitle"); // Exclude sensitive fields

  //    // Get total count of users for pagination info
  //    const totalUsers = await User.countDocuments();

  //    // Send users and pagination info
  //    res.status(200).json({
  //      totalUsers,
  //      currentPage: page,
  //      totalPages: Math.ceil(totalUsers / limit),
  //      users,
  //    });
  //  } catch (error) {
  //    // Handle unexpected errors
  //    console.error(error);
  //    res.status(500).json({ message: errorMessages.INTERNAL_SERVER_ERROR });
  //  }
  // try {
  //   // Query parameters for pagination and filtering
  //   const { page = 1, limit = 10, name, email, role } = req.query;

  //   // Validate pagination parameters
  //   const pageNumber = parseInt(page, 10);
  //   const limitNumber = parseInt(limit, 10);
  //   if (pageNumber < 1 || limitNumber < 1) {
  //     return res.status(400).json({ message: errorMessages.BAD_REQUEST });
  //   }

  //   // Build the query object based on filters
  //   const query = {};
  //   if (name) query.name = new RegExp(name, "i"); // Case-insensitive search
  //   if (email) query.email = new RegExp(email, "i"); // Case-insensitive search
  //   if (role) query.role = role;

  //   // Find users with pagination
  //   const users = await User.find(query)
  //     .skip((pageNumber - 1) * limitNumber)
  //     .limit(limitNumber)
  //     .select("-password -jobTitle"); // Exclude sensitive fields

  //   // Get total count for pagination info
  //   const totalUsers = await User.countDocuments(query);

  //   // Send the paginated response
  //   res.status(200).json({
  //     users,
  //     pagination: {
  //       page: pageNumber,
  //       limit: limitNumber,
  //       totalUsers,
  //       totalPages: Math.ceil(totalUsers / limitNumber),
  //     },
  //   });
  // } catch (error) {
  //   // Handle unexpected errors
  //   console.error(error);
  //   res.status(500).json({ message: errorMessages.INTERNAL_SERVER_ERROR });
  // }
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
};
