var GitHubStrategy = require("passport-github").Strategy;
const passport = require("passport");
const moment = require("moment");
const User = require("../database/models/User");
const yourid = require("yourid");

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            const newUser = {
                userId: profile.id,
                userMagikId: yourid.generate({
                    length: 11,
                    prefix: "",
                    includePrefix: false,
                }),
                displayName: profile.displayName,
                userName: profile.username,
                provider: profile.provider,
                profilePicture: profile.photos[0].value,
                joinedAt: moment().format("MMMM Do YYYY"),
            };

            try {
                let user = await User.findOne({ userId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
