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
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),
        images: await Image.findOne({
            uploadedBy: req.user._id,
        }),
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
            name: "Top Bot List",
            description:
                "Discord is the easiest way to communicate over voice, video, and text.  Chat, hang out, and stay close with your friends and communities.",
            link: "https://topbotlist.ml",
            logo: "https://topbotlist.ml/img/logo.png",
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
                image: image,
                name: image.imageName,
                url: image.imagePath,
                uploadedAt: image.uploadedAt,
            });
        }
    });
});

module.exports = router;
