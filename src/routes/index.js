const router = require("express").Router();
const Image = require("../database/models/image");
const GithubUser = require("../database/models/GithubUser");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index", {
        isLoggedIn: req.isAuthenticated(),
    });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    res.render("dashboard", {
        id: req.user._id,
        gitId: req.user.githubId,
        disId: req.user.displayId,
        disName: req.user.displayName,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),

        images: await Image.find({
            user: req.user.id,
        }),
    });
});

router.get("/uploads/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate(30),
            timestamp: new Date().toISOString(),
        });
    } else {
        Image.findOne({ imageId: req.params.id }, (err, image) => {
            if (err) {
                res.send("Image was not found!");
            } else {
                res.send(image);
            }
        });
    }
});

router.get("/profile/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/auth/github");
    } else {
        GithubUser.findOne({ displayId: req.params.id }, (err, user) => {
            if (err) {
                res.send("User was not found!");
            } else {
                res.render("profile", {
                    username: user.userName,
                    isLoggedIn: req.isAuthenticated(),
                });
            }
        });
    }
});

router.get("/view/:id", ensureGuest, (req, res, next) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.send(err);
        } else {
            res.render("view", {
                image: image,
                name: image.imageName,
                url: image.imagePath,
                uploadedAt: image.uploadedAt,
            });
        }
    });
});

module.exports = router;
