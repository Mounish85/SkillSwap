const authService = require("../services/authService");

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const user = await authService.registerUser({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "Registration successful",
            user
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await authService.loginUser(
            email,
            password
        );

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: result.user
        });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
}

async function logout(req, res) {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful"
    });
}

async function getCurrentUser(req, res) {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};