const SpotifyStrategy = require("passport-spotify").Strategy;
const SpotifyUser = require("../database/models/SpotifyUser");
const moment = require("moment");
const passport = require("passport");

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: "/auth/spotify/callback",
        },
        async function (accessToken, refreshToken, expires_in, profile, done) {
            const newUser = {
                spotifyId: profile.id,
                displayName: profile.displayName,
                userName: profile.username,
                profilePicture: profile.photos[0].value,
                joinedAt: moment().format("MMMM Do YYYY"),
            };

            try {
                let user = await SpotifyUser.findOne({ spotifyId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await SpotifyUser.create(newUser);
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
    SpotifyUser.findById(id, (err, user) => done(err, user));
});
