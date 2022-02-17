const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../database/models/User");
const moment = require("moment");
const passport = require("passport");
const yourid = require("yourid");

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, expires_in, profile, done) {
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
