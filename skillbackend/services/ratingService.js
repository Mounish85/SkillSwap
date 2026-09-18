const crypto = require("crypto");

const sheetsService = require("./sheetsService");

async function createRating({
    sessionId,
    fromUserId,
    toUserId,
    rating,
    review
}) {
    if (fromUserId === toUserId) {
        throw new Error(
            "You cannot rate yourself"
        );
    }

    if (rating < 1 || rating > 5) {
        throw new Error(
            "Rating must be between 1 and 5"
        );
    }

    const session = await sheetsService.findById(
        "Sessions",
        "sessionId",
        sessionId
    );

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status !== "COMPLETED") {
        throw new Error(
            "Rating is allowed only after session completion"
        );
    }

    const requests =
        await sheetsService.getRows("SwapRequests");

    const request = requests.find(
        item => item.requestId === session.requestId
    );

    if (!request) {
        throw new Error("Associated swap request not found");
    }

    const participants = [
        request.senderId,
        request.receiverId
    ];

    if (
        !participants.includes(fromUserId) ||
        !participants.includes(toUserId)
    ) {
        throw new Error(
            "User did not participate in this session"
        );
    }

    const ratings =
        await sheetsService.getRows("Ratings");

    const alreadyRated = ratings.some(
        item =>
            item.sessionId === sessionId &&
            item.fromUserId === fromUserId
    );

    if (alreadyRated) {
        throw new Error(
            "You have already rated this session"
        );
    }

    const ratingRecord = {
        ratingId: crypto.randomUUID(),
        sessionId,
        fromUserId,
        toUserId,
        rating: String(rating),
        review: review || "",
        createdAt: new Date().toISOString()
    };

    await sheetsService.appendRow(
        "Ratings",
        ratingRecord
    );

    return ratingRecord;
}

async function getUserRatings(userId) {
    const ratings =
        await sheetsService.getRows("Ratings");

    return ratings.filter(
        rating => rating.toUserId === userId
    );
}

module.exports = {
    createRating,
    getUserRatings
};