const express = require("express");

const sessionController = require("../controllers/sessionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create session
router.post(
    "/",
    sessionController.createSession
);

// Get session
router.get(
    "/:sessionId",
    sessionController.getSessionById
);

// Update session
router.put(
    "/:sessionId",
    sessionController.updateSession
);

// Complete session
router.patch(
    "/:sessionId/complete",
    sessionController.completeSession
);

// Cancel session
router.patch(
    "/:sessionId/cancel",
    sessionController.cancelSession
);

module.exports = router;