module.exports = {
  // General errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  //   NOT_FOUND: "Resource not found",
  //   BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED_ACCESS: "You do not have permission to access this resource.",
  INVALID_DATE_FORMAT: "Invalid date format",
  NO_FIELDS_TO_UPDATE: "No fields to update",

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
  UPDATED_PROFILE_PICTURE_SUCCESSFULLYl: "Profile picture updated successfully",
  UPDATE_REQUEST_SENT_SUCCESSFULLY: "Update request sent successfully",
  REQUEST_ALREADY_PENDING: "Request already pending",
  REQUEST_NOT_FOUND: "Request not found",
  REQUEST_ALREADY_APPROVED_OR_REJECTED: "Request already:",
  INVALID_PROFILE_UPDATE_STATUS:
    "Invalid action. Please use 'approve' or 'reject'.",
  REQUEST_REVIEWED_SUCCESSFULLY: "Request reviewed successfully",
  USER_DELETED_SUCCESSFULLY: "User deleted successfully",
  INVALID_ID_FORMAT: "Invalid ID format",
  USER_UPDATED_SUCCESSFULLY: "User updated successfully",
  PASSWORD_CHANGED_SUCCESSFULLY: "Password changed successfully",

  // Attendance-related errors
  ATTENDANCE_NOT_FOUND: "Attendance record not found",
  DUPLICATE_ATTENDANCE_ENTRY: "Duplicate attendance entry for the same day",
  INVALID_ATTENDANCE_STATUS: "Invalid attendance status",
  ATTENDANCE_CREATED_SUCCESSFULLY: "Attendance created successfully",
  ATTENDANCE_ALREADY_UPDATED: "Attendance already updated",

  // Feedback
  FEEDBACK_NOT_FOUND: "Feedback not found",
  FEEDBACK_ALREADY_SUBMITTED: "Feedback already submitted",
  FEEDBACK_CREATED_SUCCESSFULLY: "Feedback submitted successfully",
  FEEDBACK_UPDATED_SUCCESSFULLY: "Feedback updated successfully",
  INVALID_STATUS: "Invalid status",
  FEEDBACK_ALREADY_UPDATED: "Feedback already updated",
  FEEDBACK_DELETED_SUCCESSFULLY: "Feedback deleted successfully",

  // Employee Of The Month related errors
  EMPLOYEE_OF_THE_MONTH_NOT_FOUND: "Employee of the Month not found",
  DUPLICATE_Employee_OF_THE_MONTH:
    "Duplicate Employee of the Month entry for the same month and year",
  INVALID_Employee_OF_THE_MONTH_STATUS: "Invalid Employee of the Month status",
  EMPLOYEE_OF_THE_MONTH_CREATED_SUCCESSFULLY:
    "Employee of the Month created successfully",
  EMPLOYEE_OF_THE_MONTH_ALREADY_EXIST:
    "Employee of the month already exists for this month",
  EMPLOYEE_OF_THE_MONTH_UPDATED_SUCCESSFULLY:
    "Employee of the Month updated successfully",

  // Leave Request related errors
  LEAVE_REQUEST_CREATED_SUCCESSFULLY: "Leave request created successfully",
  LEAVE_REQUEST_UPDATED_SUCCESSFULLY: "Leave request updated successfully",
  LEAVE_REQUEST_NOT_FOUND: "Leave request not found",
  LEAVE_LIMIT_EXCEEDED: "Leave limit exceeded for the year",
  INVALID_LEAVE_DATES: "Invalid leave dates provided",
  LEAVE_BALANCE_INSUFFICIENT: "Insufficient leave balance",
  LEAVE_REQUEST_DELETED_SUCCESSFULLY: "Leave request deleted successfully",
  LEAVE_REQUEST_ALREADY_FOUND: "Leave request already found",
  STATUS_IS_REQUIRED: "Status is required",

  // NoticeBoard-related errors
  NOTICE_NOT_FOUND: "Notice not found",
  NOTICE_CREATED_SUCCESSFULLY: "Notice created successfully",
  NOTICE_ALREADY_DELETED: "Notice already deleted",
  NOTICE_DELETED_SUCCESSFULLY: "Notice deleted successfully",
  NOTICE_UPDATED_SUCCESSFULLY: "Notice updated successfully",
  INVALID_NOTICE_DETAILS: "Invalid notice details provided",

  // Chat -related errors
  CHAT_NOT_FOUND: "Chat not found",
  CHAT_CREATED_SUCCESSFULLY: "Chat created successfully",
  CHAT_ALREADY_DELETED: "Chat already deleted",
  CHAT_DELETED_SUCCESSFULLY: "Chat deleted successfully",

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

  // Notification-related errors
  //   NOTIFICATION_NOT_FOUND: "Notification not found",
  //   INVALID_NOTIFICATION_TYPE: "Invalid notification type",

  // Feedback-related errors
  //   FEEDBACK_NOT_FOUND: "Feedback not found",
  //   INVALID_FEEDBACK_TYPE: "Invalid feedback type",
};
