const yourid = require("yourid");
module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect(
                "/?redirect=" +
                    req.originalUrl +
                    "&error=You must be logged in to view this page." +
                    `&error_id=${yourid.generate(15)}`
            );
        }
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/dashboard");
        }
    },
};
