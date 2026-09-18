const crypto = require("crypto");

const sheetsService = require("./sheetsService");
const userService = require("./userService");
const userSkillService = require("./userSkillService");

async function createSwapRequest({
    senderId,
    receiverId,
    offeredSkillId,
    requestedSkillId
}) {
    if (senderId === receiverId) {
        throw new Error(
            "You cannot create a swap request with yourself"
        );
    }

    const sender = await userService.getUserById(senderId);
    const receiver = await userService.getUserById(receiverId);

    if (!sender || !receiver) {
        throw new Error("Sender or receiver not found");
    }

    const senderSkills =
        await userSkillService.getOfferedSkills(senderId);

    const receiverSkills =
        await userSkillService.getWantedSkills(receiverId);

    const senderOwnsSkill = senderSkills.some(
        skill => skill.skillId === offeredSkillId
    );

    const receiverWantsSkill = receiverSkills.some(
        skill => skill.skillId === requestedSkillId
    );

    if (!senderOwnsSkill) {
        throw new Error(
            "Offered skill does not belong to sender"
        );
    }

    if (!receiverWantsSkill) {
        throw new Error(
            "Requested skill is not wanted by receiver"
        );
    }

    const requests =
        await sheetsService.getRows("SwapRequests");

    const duplicate = requests.some(
        request =>
            request.senderId === senderId &&
            request.receiverId === receiverId &&
            request.offeredSkillId === offeredSkillId &&
            request.requestedSkillId === requestedSkillId &&
            request.status === "PENDING"
    );

    if (duplicate) {
        throw new Error(
            "An active swap request already exists"
        );
    }

    const request = {
        requestId: crypto.randomUUID(),
        senderId,
        receiverId,
        offeredSkillId,
        requestedSkillId,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await sheetsService.appendRow(
        "SwapRequests",
        request
    );

    return request;
}

async function getSentRequests(userId) {
    const requests =
        await sheetsService.getRows("SwapRequests");

    return requests.filter(
        request => request.senderId === userId
    );
}

async function getReceivedRequests(userId) {
    const requests =
        await sheetsService.getRows("SwapRequests");

    return requests.filter(
        request => request.receiverId === userId
    );
}

async function getRequestById(requestId) {
    return sheetsService.findById(
        "SwapRequests",
        "requestId",
        requestId
    );
}

async function updateRequestStatus(
    requestId,
    status
) {
    const request = await getRequestById(requestId);

    if (!request) {
        throw new Error("Swap request not found");
    }

    const validStatuses = [
        "ACCEPTED",
        "REJECTED",
        "CANCELLED"
    ];

    if (!validStatuses.includes(status)) {
        throw new Error("Invalid request status");
    }

    if (request.status !== "PENDING") {
        throw new Error(
            "Only pending requests can be updated"
        );
    }

    return sheetsService.updateRow(
        "SwapRequests",
        "requestId",
        requestId,
        {
            status,
            updatedAt: new Date().toISOString()
        }
    );
}

module.exports = {
    createSwapRequest,
    getSentRequests,
    getReceivedRequests,
    getRequestById,
    updateRequestStatus
};