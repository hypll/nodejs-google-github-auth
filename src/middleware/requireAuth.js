module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect("/login?returnURL=" + req.originalUrl);
        }
    },

    ensureAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.userRole == "admin") {
            return next();
        } else {
            res.redirect("/dashboard");
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
