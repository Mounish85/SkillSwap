const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sheetsService = require("./sheetsService");

async function registerUser({ name, email, password }) {
    const users = await sheetsService.getRows("Users");

    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        userId: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await sheetsService.appendRow("Users", user);

    return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
}

async function loginUser(email, password) {
    const users = await sheetsService.getRows("Users");

    const user = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("Account is not active");
    }

    const token = jwt.sign(
        {
            userId: user.userId,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

function verifyToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken
};