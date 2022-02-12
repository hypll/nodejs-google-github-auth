const router = require("express").Router();
const passport = require("passport");

router.get("/", (req, res) => {
    res.send(200);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
        successRedirect: "/dashboard",
    })
);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
