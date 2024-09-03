const cloudinary = require("../config/cloudinary");

const uploadImageToCloudinary = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "attendance_system/profile_pictures",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error(`Cloudinary upload error: ${error.message}`)
            );
          }
          resolve(result.secure_url);
        }
      )
      .end(imageBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      `attendance_system/profile_pictures/${publicId.trim()}`,
      (error, result) => {
        if (error) {
          return reject(
            new Error(`Failed to delete file from Cloudinary: ${error.message}`)
          );
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = { uploadImageToCloudinary, deleteFromCloudinary };
