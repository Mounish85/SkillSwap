const crypto = require("crypto");

const sheetsService = require("./sheetsService");

async function createSession({
    requestId,
    scheduledAt,
    notes
}) {
    const request = await sheetsService.findById(
        "SwapRequests",
        "requestId",
        requestId
    );

    if (!request) {
        throw new Error("Swap request not found");
    }

    if (request.status !== "ACCEPTED") {
        throw new Error(
            "Session can only be created for an accepted request"
        );
    }

    const sessions =
        await sheetsService.getRows("Sessions");

    const existing = sessions.find(
        session => session.requestId === requestId
    );

    if (existing) {
        throw new Error(
            "A session already exists for this request"
        );
    }

    const session = {
        sessionId: crypto.randomUUID(),
        requestId,
        scheduledAt,
        status: "SCHEDULED",
        notes: notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await sheetsService.appendRow(
        "Sessions",
        session
    );

    return session;
}

async function getSessionById(sessionId) {
    return sheetsService.findById(
        "Sessions",
        "sessionId",
        sessionId
    );
}

async function updateSession(sessionId, updates) {
    const session = await getSessionById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    return sheetsService.updateRow(
        "Sessions",
        "sessionId",
        sessionId,
        {
            scheduledAt: updates.scheduledAt,
            notes: updates.notes,
            updatedAt: new Date().toISOString()
        }
    );
}

async function completeSession(sessionId) {
    const session = await getSessionById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status !== "SCHEDULED") {
        throw new Error(
            "Only scheduled sessions can be completed"
        );
    }

    return sheetsService.updateRow(
        "Sessions",
        "sessionId",
        sessionId,
        {
            status: "COMPLETED",
            updatedAt: new Date().toISOString()
        }
    );
}

async function cancelSession(sessionId) {
    const session = await getSessionById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.status === "COMPLETED") {
        throw new Error(
            "Completed session cannot be cancelled"
        );
    }

    return sheetsService.updateRow(
        "Sessions",
        "sessionId",
        sessionId,
        {
            status: "CANCELLED",
            updatedAt: new Date().toISOString()
        }
    );
}

module.exports = {
    createSession,
    getSessionById,
    updateSession,
    completeSession,
    cancelSession
};