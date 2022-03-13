const router = require("express").Router();
const User = require("../database/models/User");

const {
    ensureAuth,
    ensureGuest,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
    });
});

module.exports = router;
