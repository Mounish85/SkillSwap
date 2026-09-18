const crypto = require("crypto");

const driveService = require("../services/driveService");
const sheetsService = require("../services/sheetsService");

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            });
        }

        const driveFile =
            await driveService.uploadFile(req.file);

        const fileRecord = {
            fileId: crypto.randomUUID(),
            userId: req.user.userId,
            fileName: driveFile.name,
            driveFileId: driveFile.id,
            driveUrl:
                driveFile.webViewLink ||
                `https://drive.google.com/file/d/${driveFile.id}/view`,
            fileType: driveFile.mimeType,
            uploadedAt: new Date().toISOString()
        };

        await sheetsService.appendRow(
            "Files",
            fileRecord
        );

        res.status(201).json({
            message: "File uploaded successfully",
            file: fileRecord
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getUserFiles(req, res) {
    try {
        const files =
            await sheetsService.getRows("Files");

        const userFiles = files.filter(
            file =>
                file.userId === req.user.userId
        );

        res.status(200).json({
            files: userFiles
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function deleteFile(req, res) {
    try {
        const file =
            await sheetsService.findById(
                "Files",
                "fileId",
                req.params.fileId
            );

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        if (
            file.userId !== req.user.userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await driveService.deleteFile(
            file.driveFileId
        );

        await sheetsService.deleteRow(
            "Files",
            "fileId",
            req.params.fileId
        );

        res.status(200).json({
            message: "File deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    uploadFile,
    getUserFiles,
    deleteFile
};