const ratingService = require("../services/ratingService");

async function createRating(req, res) {
    try {
        const {
            sessionId,
            toUserId,
            rating,
            review
        } = req.body;

        if (
            !sessionId ||
            !toUserId ||
            rating === undefined
        ) {
            return res.status(400).json({
                message:
                    "Session, target user and rating are required"
            });
        }

        const ratingRecord =
            await ratingService.createRating({
                sessionId,
                fromUserId: req.user.userId,
                toUserId,
                rating: Number(rating),
                review
            });

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: ratingRecord
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getUserRatings(req, res) {
    try {
        const ratings =
            await ratingService.getUserRatings(
                req.params.userId
            );

        res.status(200).json({
            ratings
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createRating,
    getUserRatings
};