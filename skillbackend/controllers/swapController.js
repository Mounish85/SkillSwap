const swapService = require("../services/swapService");

async function createSwapRequest(req, res) {
    try {
        const {
            receiverId,
            offeredSkillId,
            requestedSkillId
        } = req.body;

        if (
            !receiverId ||
            !offeredSkillId ||
            !requestedSkillId
        ) {
            return res.status(400).json({
                message:
                    "Receiver, offered skill and requested skill are required"
            });
        }

        const request =
            await swapService.createSwapRequest({
                senderId: req.user.userId,
                receiverId,
                offeredSkillId,
                requestedSkillId
            });

        res.status(201).json({
            message: "Swap request created",
            request
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getSentRequests(req, res) {
    try {
        const requests =
            await swapService.getSentRequests(
                req.user.userId
            );

        res.status(200).json({
            requests
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getReceivedRequests(req, res) {
    try {
        const requests =
            await swapService.getReceivedRequests(
                req.user.userId
            );

        res.status(200).json({
            requests
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getRequestById(req, res) {
    try {
        const request =
            await swapService.getRequestById(
                req.params.requestId
            );

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (
            request.senderId !== req.user.userId &&
            request.receiverId !== req.user.userId
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        res.status(200).json({
            request
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function acceptRequest(req, res) {
    try {
        const request =
            await swapService.getRequestById(
                req.params.requestId
            );

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (request.receiverId !== req.user.userId) {
            return res.status(403).json({
                message: "Only the receiver can accept this request"
            });
        }

        const updatedRequest =
            await swapService.updateRequestStatus(
                request.requestId,
                "ACCEPTED"
            );

        res.status(200).json({
            message: "Swap request accepted",
            request: updatedRequest
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function rejectRequest(req, res) {
    try {
        const request =
            await swapService.getRequestById(
                req.params.requestId
            );

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (request.receiverId !== req.user.userId) {
            return res.status(403).json({
                message: "Only the receiver can reject this request"
            });
        }

        const updatedRequest =
            await swapService.updateRequestStatus(
                request.requestId,
                "REJECTED"
            );

        res.status(200).json({
            message: "Swap request rejected",
            request: updatedRequest
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function cancelRequest(req, res) {
    try {
        const request =
            await swapService.getRequestById(
                req.params.requestId
            );

        if (!request) {
            return res.status(404).json({
                message: "Swap request not found"
            });
        }

        if (request.senderId !== req.user.userId) {
            return res.status(403).json({
                message: "Only the sender can cancel this request"
            });
        }

        const updatedRequest =
            await swapService.updateRequestStatus(
                request.requestId,
                "CANCELLED"
            );

        res.status(200).json({
            message: "Swap request cancelled",
            request: updatedRequest
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    createSwapRequest,
    getSentRequests,
    getReceivedRequests,
    getRequestById,
    acceptRequest,
    rejectRequest,
    cancelRequest
};