const express = require("express");

const ratingController = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit rating
router.post(
    "/",
    authMiddleware,
    ratingController.createRating
);

// Get ratings received by user
router.get(
    "/user/:userId",
    authMiddleware,
    ratingController.getUserRatings
);

module.exports = router;