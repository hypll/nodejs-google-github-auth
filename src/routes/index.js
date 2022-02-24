const router = require("express").Router();
const User = require("../database/models/User");
const Image = require("../database/models/image");
const fileSize = require("filesize");
const {
    ensureAuth,
    ensureGuest,
    ensureAdmin,
    ensureLoggedIn,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index", {
        isLoggedIn: req.isAuthenticated(),
    });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    res.render("pages/dashboard/index", {
        id: req.user._id,
        userId: req.user.userId,
        userRole: req.user.userRole,
        userStorage: fileSize(req.user.userStorage),
        disName: req.user.displayName,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        userMagikId: req.user.userMagikId,
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        allUsers: "/api/users",
        isPremium: req.user.premium,
        isLoggedIn: req.isAuthenticated(),
        host: process.env.HOST,

        images: await Image.find({ user: req.user._id }),
    });
});

router.get("/dashboard/admin", ensureAdmin, async (req, res) => {
    res.render("pages/dashboard/admin", {
        id: req.user._id,
        userId: req.user.userId,
        userRole: req.user.userRole,
        disName: req.user.displayName,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        userMagikId: req.user.userMagikId,
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),

        users: await User.find({ user: req.user._id }),
    });
});

router.get("/dashboard/admin/search", ensureAdmin, async (req, res) => {
    res.render("pages/dashboard/search", {
        id: req.user._id,
        userId: req.user.userId,
        userRole: req.user.userRole,
        disName: req.user.displayName,
        username: req.user.userName,
        profilePicture: req.user.profilePicture,
        userMagikId: req.user.userMagikId,
        bio: req.user.userBio,
        joinedAt: req.user.joinedAt,
        isLoggedIn: req.isAuthenticated(),
        search: req.query.target,

        users: await User.find({ user: req.user._id }),
    });
});

router.get("/login", ensureGuest, ensureLoggedIn, async (req, res) => {
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

router.get("/profile/:id", ensureAuth, async (req, res, next) => {
    User.findOne({ userMagikId: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.render("pages/profile/index", {
                id: user._id,
                userId: user.userId,
                userRole: user.userRole,
                disName: user.displayName,
                username: user.userName,
                magikId: user.userMagikId,
                profilePicture: user.profilePicture,
                userMagikId: user.userMagikId,
                bio: user.userBio,
                joinedAt: user.joinedAt,
                host: process.env.HOST,
                isLoggedIn: req.isAuthenticated(),

                // The user there are logged in, and have access to the profile of the user that is being looked at.
                trueId: req.user._id,
                trueUserId: req.user.userId,

                images: "/api/images",
                //images: await Image.find({ user: req.user._id }),
            });
        }
    });
});

router.get("/view/:id", ensureGuest, (req, res, next) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.send(err);
        } else {
            res.render("view", {
                id: req.user._id,
                userRole: req.user.userRole,
                imageId: image._id,
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
