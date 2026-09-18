const { google } = require("googleapis");
const { getAuthenticatedClient } = require("../config/googleAuth");

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function getDriveClient() {
    const auth = getAuthenticatedClient();

    if (!auth) {
        throw new Error(
            "Google authentication required. Complete OAuth authorization first."
        );
    }

    return google.drive({
        version: "v3",
        auth
    });
}

async function uploadFile(file) {
    const drive = await getDriveClient();

    const response = await drive.files.create({
        requestBody: {
            name: file.originalname,
            parents: [ROOT_FOLDER_ID]
        },
        media: {
            mimeType: file.mimetype,
            body: require("stream").Readable.from(file.buffer)
        },
        fields: "id,name,mimeType,webViewLink"
    });

    return response.data;
}

async function getFile(fileId) {
    const drive = await getDriveClient();

    const response = await drive.files.get({
        fileId,
        fields: "id,name,mimeType,size,webViewLink,createdTime"
    });

    return response.data;
}

async function deleteFile(fileId) {
    const drive = await getDriveClient();

    await drive.files.delete({
        fileId
    });

    return true;
}

module.exports = {
    uploadFile,
    getFile,
    deleteFile
};