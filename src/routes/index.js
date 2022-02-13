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
        gitId: req.user.githubId,
        disId: req.user.displayId,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),
    });
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
