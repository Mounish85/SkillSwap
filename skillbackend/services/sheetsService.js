const { google } = require("googleapis");
const { getAuthenticatedClient } = require("../config/googleAuth");

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

const SHEETS = {
    Users: [
        "userId",
        "name",
        "email",
        "passwordHash",
        "role",
        "status",
        "createdAt",
        "updatedAt"
    ],

    Skills: [
        "skillId",
        "skillName",
        "category",
        "createdAt"
    ],

    UserSkills: [
        "userSkillId",
        "userId",
        "skillId",
        "type",
        "level",
        "createdAt"
    ],

    SwapRequests: [
        "requestId",
        "senderId",
        "receiverId",
        "offeredSkillId",
        "requestedSkillId",
        "status",
        "createdAt",
        "updatedAt"
    ],

    Sessions: [
        "sessionId",
        "requestId",
        "scheduledAt",
        "status",
        "notes",
        "createdAt",
        "updatedAt"
    ],

    Ratings: [
        "ratingId",
        "sessionId",
        "fromUserId",
        "toUserId",
        "rating",
        "review",
        "createdAt"
    ],

    Files: [
        "fileId",
        "userId",
        "fileName",
        "driveFileId",
        "driveUrl",
        "fileType",
        "uploadedAt"
    ],

    Notifications: [
        "notificationId",
        "userId",
        "type",
        "message",
        "relatedId",
        "isRead",
        "createdAt"
    ]
};

async function getSheetsClient() {
    const auth = getAuthenticatedClient();

    if (!auth) {
        throw new Error(
            "Google authentication required. Complete OAuth authorization first."
        );
    }

    return google.sheets({
        version: "v4",
        auth
    });
}

async function getSpreadsheet() {
    const sheets = await getSheetsClient();

    const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
    });

    return response.data;
}

async function initializeSheets() {
    const sheets = await getSheetsClient();
    const spreadsheet = await getSpreadsheet();

    const existingSheets = spreadsheet.sheets.map(
        sheet => sheet.properties.title
    );

    const requests = [];

    for (const [sheetName, headers] of Object.entries(SHEETS)) {
        if (!existingSheets.includes(sheetName)) {
            requests.push({
                addSheet: {
                    properties: {
                        title: sheetName
                    }
                }
            });
        }
    }

    if (requests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests
            }
        });
    }

    for (const [sheetName, headers] of Object.entries(SHEETS)) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1`,
            valueInputOption: "RAW",
            requestBody: {
                values: [headers]
            }
        });
    }

    console.log("Google Sheets database initialized.");
}

async function getRows(sheetName) {
    const sheets = await getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName
    });

    const values = response.data.values || [];

    if (values.length <= 1) {
        return [];
    }

    const headers = values[0];

    return values.slice(1).map(row => {
        const object = {};

        headers.forEach((header, index) => {
            object[header] = row[index] || "";
        });

        return object;
    });
}

async function appendRow(sheetName, data) {
    const sheets = await getSheetsClient();

    const headers = SHEETS[sheetName];

    if (!headers) {
        throw new Error(`Unknown sheet: ${sheetName}`);
    }

    const values = headers.map(header => data[header] ?? "");

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [values]
        }
    });

    return data;
}

async function updateRow(sheetName, idField, idValue, data) {
    const sheets = await getSheetsClient();

    const rows = await getRows(sheetName);

    const index = rows.findIndex(
        row => row[idField] === idValue
    );

    if (index === -1) {
        throw new Error(`${sheetName} record not found`);
    }

    const headers = SHEETS[sheetName];

    const updatedRow = headers.map(
        header => data[header] ?? rows[index][header] ?? ""
    );

    const actualRowNumber = index + 2;

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A${actualRowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [updatedRow]
        }
    });

    return {
        ...rows[index],
        ...data
    };
}

async function deleteRow(sheetName, idField, idValue) {
    const sheets = await getSheetsClient();

    const spreadsheet = await getSpreadsheet();

    const sheet = spreadsheet.sheets.find(
        sheet => sheet.properties.title === sheetName
    );

    if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found`);
    }

    const rows = await getRows(sheetName);

    const index = rows.findIndex(
        row => row[idField] === idValue
    );

    if (index === -1) {
        throw new Error(`${sheetName} record not found`);
    }

    const rowNumber = index + 1;

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheet.properties.sheetId,
                            dimension: "ROWS",
                            startIndex: rowNumber,
                            endIndex: rowNumber + 1
                        }
                    }
                }
            ]
        }
    });

    return true;
}

async function findById(sheetName, idField, idValue) {
    const rows = await getRows(sheetName);

    return (
        rows.find(row => row[idField] === idValue) ||
        null
    );
}

module.exports = {
    SHEETS,
    initializeSheets,
    getRows,
    appendRow,
    updateRow,
    deleteRow,
    findById
};