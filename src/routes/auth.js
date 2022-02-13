const router = require("express").Router();
const passport = require("passport");
const GithubUser = require("../database/models/GithubUser");

router.get("/", (req, res) => {
    res.send(200);
});

// Github Auth

router.get("/github", passport.authenticate("github"));

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

// Account Management

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/delete", (req, res) => {
    GithubUser.findOneAndDelete(
        { githubId: req.user.githubId },
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/");
            }
        }
    );
});

module.exports = router;
