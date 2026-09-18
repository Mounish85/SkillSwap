const express = require("express");

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get user
router.get(
    "/:userId",
    authMiddleware,
    userController.getUserById
);

// Get user profile
router.get(
    "/:userId/profile",
    authMiddleware,
    userController.getUserProfile
);

// Update user
router.put(
    "/:userId",
    authMiddleware,
    userController.updateUser
);

module.exports = router;