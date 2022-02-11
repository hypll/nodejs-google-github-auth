require("dotenv").config();
require("./src/database/connect");
require("./src/utils/logger");
const express = require("express");
const path = require("path");
const app = express();
const chalk = require("chalk");
const PORT = process.env.PORT || 5000;

// Routes
const apiRouter = require("./src/routes/api");
const indexRouter = require("./src/routes/index");

app.use("/api", apiRouter);
app.use("/", indexRouter);

// Settings & middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Start server
app.listen(PORT, () => {
    console.log(`💻 Server is running on port ${chalk.redBright(PORT)}`);
});
