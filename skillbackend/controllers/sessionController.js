const sessionService = require("../services/sessionService");

async function createSession(req, res) {
    try {
        const {
            requestId,
            scheduledAt,
            notes
        } = req.body;

        if (!requestId || !scheduledAt) {
            return res.status(400).json({
                message:
                    "Request ID and scheduled time are required"
            });
        }

        const session =
            await sessionService.createSession({
                requestId,
                scheduledAt,
                notes
            });

        res.status(201).json({
            message: "Session created successfully",
            session
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getSessionById(req, res) {
    try {
        const session =
            await sessionService.getSessionById(
                req.params.sessionId
            );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            session
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function updateSession(req, res) {
    try {
        const session =
            await sessionService.updateSession(
                req.params.sessionId,
                req.body
            );

        res.status(200).json({
            message: "Session updated successfully",
            session
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function completeSession(req, res) {
    try {
        const session =
            await sessionService.completeSession(
                req.params.sessionId
            );

        res.status(200).json({
            message: "Session completed successfully",
            session
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function cancelSession(req, res) {
    try {
        const session =
            await sessionService.cancelSession(
                req.params.sessionId
            );

        res.status(200).json({
            message: "Session cancelled successfully",
            session
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    createSession,
    getSessionById,
    updateSession,
    completeSession,
    cancelSession
};