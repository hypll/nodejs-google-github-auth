var GitHubStrategy = require("passport-github").Strategy;
const passport = require("passport");
const GithubUser = require("../database/models/GithubUser");

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            const newUser = {
                githubId: profile.id,
                displayName: profile.displayName,
                userName: profile.username,
                profilePicture: profile.photos[0].value,
            };

            try {
                let user = await GithubUser.findOne({ githubId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await GithubUser.create(newUser);
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
    GithubUser.findById(id, (err, user) => done(err, user));
});
