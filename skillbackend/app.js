require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const googleAuth = require("./config/googleAuth");
const sheetsService = require("./services/sheetsService");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const userSkillRoutes = require("./routes/userSkillRoutes");
const swapRoutes = require("./routes/swapRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

const PORT = process.env.PORT || 3000;


//Middleware
app.use(express.json());

app.use(morgan('dev'));

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);



app.get("/", (req, res) => {
    res.status(200).json({
        message: "SkillSwap backend is running"
    });
});


app.get("/oauth2", (req, res) => {
    try {
        const authUrl = googleAuth.getAuthUrl();

        res.redirect(authUrl);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/oauth2/callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                message: "Authorization code is missing"
            });
        }

        await googleAuth.handleOAuthCallback(code);

        res.status(200).send(`
            <h2>Google authentication successful</h2>
            <p>You can close this window and return to SkillSwap.</p>
        `);
    } catch (error) {
        console.error("Google OAuth error:", error);

        res.status(500).json({
            message: "Google authentication failed",
            error: error.message
        });
    }
});



//Routes
app.use("/skill/auth", authRoutes);

app.use("/skill/users", userRoutes);

app.use("/skill/skills", skillRoutes);

app.use("/skill/user-skills", userSkillRoutes);

app.use("/skill/swaps", swapRoutes);

app.use("/skill/sessions", sessionRoutes);

app.use("/skill/ratings", ratingRoutes);

app.use("/skill/files", fileRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});



app.listen(PORT, async () => {
    console.log(
        `SkillSwap server running on http://localhost:${PORT}`
    );

    try {
        const auth = googleAuth.getAuthenticatedClient();

        if (auth) {
            await sheetsService.initializeSheets();

            console.log("Google Sheets database ready.");
        } else {
            console.log(
                "Google authentication required."
            );

            console.log(
                "Open http://localhost:3000/oauth2"
            );
        }
    } catch (error) {
        console.error(
            "Google Sheets initialization failed:",
            error.message
        );
    }
});