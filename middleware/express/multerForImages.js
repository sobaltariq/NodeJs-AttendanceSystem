const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
