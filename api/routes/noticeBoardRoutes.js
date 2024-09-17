const express = require("express");
const router = express.Router();
const {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeBoardController");
const { checkAdminRole } = require("../../middleware/express/userTypeCheck");
const {
  verifyLoginToken,
} = require("../../middleware/express/verifyLoginToken");
const {
  createNoticeValidationRules,
  updateNoticeValidationRules,
} = require("../../validator/noticeValidations");
const validateRequest = require("../../middleware/express/validateRequestMiddleware");

// Notice routes
router.post(
  "/",
  verifyLoginToken,
  checkAdminRole,
  createNoticeValidationRules(),
  validateRequest,
  createNotice
);
router.get("/", verifyLoginToken, getAllNotices);
router.patch(
  "/:id",
  verifyLoginToken,
  checkAdminRole,
  updateNoticeValidationRules(),
  validateRequest,
  updateNotice
);
router.delete("/:id", verifyLoginToken, checkAdminRole, deleteNotice);

module.exports = router;
