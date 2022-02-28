const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const moment = require("moment");
const yourid = require("yourid");
const User = require("../database/models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            const newUser = {
                userId: profile.id,
                userMagikId: yourid.generate({
                    length: 11,
                    prefix: "",
                    includePrefix: false,
                }),
                displayName: profile.displayName,
                userEmail: profile.emails[0].value,
                userName: `${profile.name.givenName}-${profile.name.familyName}`,
                provider: profile.provider,
                profilePicture: profile.photos[0].value,
                apiKey: yourid.generate({
                    length: 30,
                    prefix: "",
                    includePrefix: false,
                }),
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
