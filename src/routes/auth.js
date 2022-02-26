const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");
const Image = require("../database/models/image");

router.get("/", (req, res) => {
    res.send(200);
});

// Github Auth

router.get("/github", passport.authenticate("github", { scope: "user:email" }));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/dashboard");
    }
);

// Spotify Auth

router.get("/spotify", passport.authenticate("spotify"));

router.get(
    "/spotify/callback",
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/dashboard");
    }
);

// Google Auth

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/dashboard");
    }
);

// Account Management

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
