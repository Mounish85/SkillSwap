const express = require("express");

const swapController = require("../controllers/swapController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create swap request
router.post(
    "/",
    swapController.createSwapRequest
);

// Sent requests
router.get(
    "/sent",
    swapController.getSentRequests
);

// Received requests
router.get(
    "/received",
    swapController.getReceivedRequests
);

// Get specific request
router.get(
    "/:requestId",
    swapController.getRequestById
);

// Accept request
router.patch(
    "/:requestId/accept",
    swapController.acceptRequest
);

// Reject request
router.patch(
    "/:requestId/reject",
    swapController.rejectRequest
);

// Cancel request
router.patch(
    "/:requestId/cancel",
    swapController.cancelRequest
);

module.exports = router;