const { body, check, validationResult } = require("express-validator");

// Middleware to validate file upload
const validateProfilePictureRules = [
  check("profilePicture").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("No Picture uploaded");
    }

    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(req.file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(req.file.mimetype);

    if (!mimetype || !extname) {
      throw new Error(
        "Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed."
      );
    }

    // File size limit: 2MB
    if (req.file.size > 2 * 1024 * 1024) {
      throw new Error("File size exceeds 2MB.");
    }

    return true;
  }),
];

module.exports = {
  validateProfilePictureRules,
};
