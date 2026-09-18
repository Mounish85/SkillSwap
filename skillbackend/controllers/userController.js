const userService = require("../services/userService");

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(
            req.params.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            passwordHash,
            ...safeUser
        } = user;

        res.status(200).json({
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getUserProfile(req, res) {
    try {
        const user = await userService.getUserById(
            req.params.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            passwordHash,
            ...profile
        } = user;

        res.status(200).json({
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.userId;

        if (
            req.user.userId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const updatedUser =
            await userService.updateUser(
                userId,
                req.body
            );

        const {
            passwordHash,
            ...safeUser
        } = updatedUser;

        res.status(200).json({
            message: "User updated successfully",
            user: safeUser
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    getUserById,
    getUserProfile,
    updateUser
};