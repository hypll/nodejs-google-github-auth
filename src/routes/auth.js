const router = require("express").Router();
const passport = require("passport");

router.get("/", (req, res) => {
    res.send(200);
});

router.get("/github", passport.authenticate("github"));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/dashboard");
    }
);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
