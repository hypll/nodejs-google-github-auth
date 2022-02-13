const yourid = require("yourid");
module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/auth/github/callback");
        }
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return next();
        }
    },
};
