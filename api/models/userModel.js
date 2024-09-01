const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    gender: { type: String },
    bankName: { type: String },
    ibanNumber: { type: String },
    whatsApp: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    officeLocation: { type: String },
    position: { type: String, default: "Internee" },
    leaveBalance: { type: Number, default: 0 },
    lastLogin: { type: Date },
    attendanceHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    ],
    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
    employerOfTheMonthCount: { type: Number, default: 0 },
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

module.exports = mongoose.model("User", userSchema);
