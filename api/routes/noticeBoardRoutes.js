const express = require("express");
const router = express.Router();
const noticeBoardController = require("../controllers/noticeBoardController");

// Notice routes
router.post("/", noticeBoardController.createNotice);
router.get("/", noticeBoardController.getAllNotices);
router.get("/:id", noticeBoardController.getNoticeById);
router.put("/:id", noticeBoardController.updateNotice);
router.delete("/:id", noticeBoardController.deleteNotice);

module.exports = router;
