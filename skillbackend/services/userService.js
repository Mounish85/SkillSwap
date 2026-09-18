const sheetsService = require("./sheetsService");

async function getUserById(userId) {
    return sheetsService.findById(
        "Users",
        "userId",
        userId
    );
}

async function getUserByEmail(email) {
    const users = await sheetsService.getRows("Users");

    return (
        users.find(
            user =>
                user.email.toLowerCase() === email.toLowerCase()
        ) || null
    );
}

async function updateUser(userId, updates) {
    const allowedFields = [
        "name",
        "status"
    ];

    const data = {};

    for (const field of allowedFields) {
        if (updates[field] !== undefined) {
            data[field] = updates[field];
        }
    }

    data.updatedAt = new Date().toISOString();

    return sheetsService.updateRow(
        "Users",
        "userId",
        userId,
        data
    );
}

module.exports = {
    getUserById,
    getUserByEmail,
    updateUser
};