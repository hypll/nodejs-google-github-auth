const twitchStrategy = require("passport-twitch").Strategy;
const passport = require("passport");
const User = require("../database/models/User");

passport.use(
    new twitchStrategy(
        {
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: "/auth/twitch/callback",
            scope: "user_read",
        },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
