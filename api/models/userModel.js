const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const appConst = require("../../utils/constants/constant");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      required: true,
      default: "user",
    },
    gender: { type: String, enum: ["male", "female", "other"] },
    bankName: { type: String },
    ibanNumber: { type: String },
    whatsApp: { type: String },
    phoneNumber: { type: String },
    salary: { type: String },
    nic: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    emergencyContact: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    officeLocation: { type: String },
    position: { type: String, default: "Other" },
    userStatus: {
      type: String,
      enum: ["Permanent", "Contract", "Internship", "Probation", "Other"],
      default: "Other",
    },
    leaveRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "LeaveRequest" },
    ],
    paidLeavesTaken: {
      type: Number,
      default: 0,
    },
    leaveBalance: { type: Number, default: appConst._maxLeavesPerYear },
    lastLogin: { type: Date },
    attendanceHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    ],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
    employeeOfTheMonthCount: { type: Number, default: 0 },
    monthlyPoints: { type: Number, default: 0 },
    pendingUpdate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PendingUpdate",
    },
    hireDate: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for quick search
userSchema.index({ email: 1 }, { unique: true });

// Remove password from the response
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Middleware to update timestamps
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Helper function to generate a unique username based on the user's name
async function generateUsername(name) {
  const baseUsername = name.toLowerCase().replace(/\s+/g, ""); // Remove spaces and lowercase
  let username = baseUsername;
  let count = 1;

  // Check for uniqueness and append numbers if necessary
  while (await mongoose.model("User").findOne({ username })) {
    username = `${baseUsername}${count}`;
    count++;
  }

  return username;
}

// Middleware to assign the username only when creating a new user
userSchema.pre("save", async function (next) {
  if (this.isNew && !this.username) {
    try {
      this.username = await generateUsername(this.name);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
