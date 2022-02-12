require("dotenv").config();
require("./src/database/connect");
require("./src/utils/logger");
const express = require("express");
const path = require("path");
const app = express();
const chalk = require("chalk");
const passport = require("passport");
const session = require("express-session");
const PORT = process.env.PORT || 5000;

// Routes
const apiRouter = require("./src/routes/api");
const authRouter = require("./src/routes/auth");
const indexRouter = require("./src/routes/index");

// Use Routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/", indexRouter);

// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Settings & Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Start server
app.listen(PORT, () => {
    console.log(`💻 Server is running on port ${chalk.redBright(PORT)}`);
});
