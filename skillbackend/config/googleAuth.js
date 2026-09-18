const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
];

const CREDENTIALS_PATH = path.join(
    __dirname,
    "..",
    "credentials",
    "credentials.json"
);

const TOKEN_PATH = path.join(
    __dirname,
    "..",
    "credentials",
    "token.json"
);

let oauth2Client = null;

/**
 * Create Google OAuth2 client
 */
function createOAuthClient() {
    if (oauth2Client) {
        return oauth2Client;
    }

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(
            "Google OAuth credentials.json not found in /credentials"
        );
    }

    const credentials = JSON.parse(
        fs.readFileSync(CREDENTIALS_PATH, "utf-8")
    );

    const { client_id, client_secret } = credentials.web;

    oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        process.env.GOOGLE_REDIRECT_URI
    );

    return oauth2Client;
}

/**
 * Generate Google OAuth authorization URL
 */
function getAuthUrl() {
    const client = createOAuthClient();

    return client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });
}

/**
 * Exchange authorization code for tokens
 */
async function handleOAuthCallback(code) {
    const client = createOAuthClient();

    const { tokens } = await client.getToken(code);

    client.setCredentials(tokens);

    fs.writeFileSync(
        TOKEN_PATH,
        JSON.stringify(tokens, null, 2)
    );

    return client;
}

/**
 * Get authenticated Google client
 */
function getAuthenticatedClient() {
    const client = createOAuthClient();

    if (!fs.existsSync(TOKEN_PATH)) {
        return null;
    }

    const tokens = JSON.parse(
        fs.readFileSync(TOKEN_PATH, "utf-8")
    );

    client.setCredentials(tokens);

    return client;
}

module.exports = {
    createOAuthClient,
    getAuthUrl,
    handleOAuthCallback,
    getAuthenticatedClient,
    SCOPES
};