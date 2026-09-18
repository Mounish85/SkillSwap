const express = require("express");
const multer = require("multer");

const fileController = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.use(authMiddleware);

// Upload file
router.post(
    "/",
    upload.single("file"),
    fileController.uploadFile
);

// Get current user's files
router.get(
    "/",
    fileController.getUserFiles
);

// Delete file
router.delete(
    "/:fileId",
    fileController.deleteFile
);

module.exports = router;