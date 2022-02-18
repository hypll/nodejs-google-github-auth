const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");
const Image = require("../database/models/image");

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

// Google Auth

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

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

router.get("/delete", (req, res) => {
    User.findOneAndDelete({ userId: req.user.userId }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/delete/image/:id", (req, res) => {
    Image.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/dashboard?deleted=true&id=" + user._id);
        }
    });
});

router.get("/delete/user/:id", (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/dashboard/admin?deleted=true&id=" + user._id);
        }
    });
});

module.exports = router;
