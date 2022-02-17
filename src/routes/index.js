const router = require("express").Router();
const User = require("../database/models/User");
const Image = require("../database/models/image");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index", {
        isLoggedIn: req.isAuthenticated(),
    });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    res.render("dashboard", {
        id: req.user._id,
        userId: req.user.userId,
        disName: req.user.displayName,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        userMagikId: req.user.userMagikId,
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),

        images: await Image.find({ user: req.user._id }),
    });
});

router.get("/login", ensureGuest, async (req, res) => {
    res.render("login", {
        isLoggedIn: req.isAuthenticated(),
    });
});

router.get("/partners", ensureGuest, (req, res) => {
    const partners = [
        {
            id: 1,
            name: "No One",
            description:
                "No partners, this is just a placeholder for the partners page.",
            link: "/",
            logo: "https://via.placeholder.com/150",
        },
    ];

    res.render("partners", {
        isLoggedIn: req.isAuthenticated(),
        partnerId: partners[0].id,
        partnerName: partners[0].name,
        partnerDescription: partners[0].description,
        partnerLink: partners[0].link,
        partnerLogo: partners[0].logo,
        partner: partners,
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
        res.redirect("/login");
    } else {
        User.findOne({ displayId: req.params.id }, (err, user) => {
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
                imageId: image.imageId,
                image: image,
                name: image.imageName,
                url: image.imagePath,
                uploadedAt: image.uploadedAt,
                host: process.env.HOST,
                isLoggedIn: req.isAuthenticated(),
            });
        }
    });
});

router.get("/share/:id", ensureGuest, (req, res, next) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.send(err);
        } else {
            res.render("share", {
                imageId: image.imageId,
                image: image,
                name: image.imageName,
                url: image.imagePath,
                uploadedAt: image.uploadedAt,
                host: process.env.HOST,
                isLoggedIn: req.isAuthenticated(),
            });
        }
    });
});

module.exports = router;
