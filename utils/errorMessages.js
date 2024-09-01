module.exports = {
  // General errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  //   NOT_FOUND: "Resource not found",
  //   BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED_ACCESS: "You do not have permission to access this resource.",

  // ##### User-related errors #####
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS:
    "Email already registered, please try another email, or contact the admin",
  SERVER_ERROR: "An error occurred on the server",
  EMAIL_NOT_FOUND: "Email not found",
  INVALID_PASSWORD: "Invalid password",
  ALREADY_LOGGED_IN: "You are already logged in",
  NO_TOKEN_PROVIDED: "Access denied. No token provided.",
  INVALID_TOKEN: "Invalid or expired token.",
  LOGIN_SUCCESS: "Login successful.",
  REGISTRATION_SUCCESS: "Registration successfully",
  LOGOUT_SUCCESS: "Logged out successfully.",
  NO_FIELDS_TO_UPDATE: "No fields to update",
  UPDATED_PROFILE_PICTURE_SUCCESSFULLYl: "Profile picture updated successfully",
  UPDATE_REQUEST_SENT_SUCCESSFULLY: "Update request sent successfully",
  REQUEST_ALREADY_PENDING: "Request already pending",
  REQUEST_NOT_FOUND: "Request not found",
  REQUEST_ALREADY_APPROVED_OR_REJECTED: "Request already:",
  INVALID_PROFILE_UPDATE_STATUS:
    "Invalid action. Please use 'approve' or 'reject'.",
  REQUEST_REVIEWED_SUCCESSFULLY: "Request reviewed successfully",
  USER_DELETED_SUCCESSFULLY: "User deleted successfully",

  //   INVALID_CREDENTIALS: "Invalid credentials",
  //   PASSWORD_TOO_WEAK: "Password must be at least 8 characters long and include a mix of letters and numbers",
  // Product-related errors
  //   PRODUCT_NOT_FOUND: "Product not found",
  //   PRODUCT_ALREADY_EXISTS: "Product already exists",
  //   INSUFFICIENT_STOCK: "Insufficient stock",
  //   INVALID_PRODUCT_DETAILS: "Invalid product details provided",
  // Order-related errors
  //   ORDER_NOT_FOUND: "Order not found",
  //   INVALID_ORDER_STATUS: "Invalid order status",
  //   INSUFFICIENT_FUNDS: "Insufficient funds",
  //   ORDER_CANCELLATION_NOT_ALLOWED: "Order cancellation not allowed at this stage",
  // Leave-related errors
  //   LEAVE_REQUEST_NOT_FOUND: "Leave request not found",
  //   LEAVE_LIMIT_EXCEEDED: "Leave limit exceeded for the year",
  //   INVALID_LEAVE_DATES: "Invalid leave dates provided",
  //   LEAVE_BALANCE_INSUFFICIENT: "Insufficient leave balance",
  // Attendance-related errors
  //   ATTENDANCE_NOT_FOUND: "Attendance record not found",
  //   DUPLICATE_ATTENDANCE_ENTRY: "Duplicate attendance entry for the same day",
  //   INVALID_ATTENDANCE_STATUS: "Invalid attendance status",
  // Notification-related errors
  //   NOTIFICATION_NOT_FOUND: "Notification not found",
  //   INVALID_NOTIFICATION_TYPE: "Invalid notification type",
  // NoticeBoard-related errors
  //   NOTICE_NOT_FOUND: "Notice not found",
  //   INVALID_NOTICE_DETAILS: "Invalid notice details provided",
  // Feedback-related errors
  //   FEEDBACK_NOT_FOUND: "Feedback not found",
  //   INVALID_FEEDBACK_TYPE: "Invalid feedback type",
  // EmployerOfTheMonth-related errors
  //   EMPLOYER_OF_THE_MONTH_NOT_FOUND: "Employer of the Month record not found",
  //   DUPLICATE_EMPLOYER_OF_THE_MONTH: "Duplicate Employer of the Month entry for the same month and year",
};
