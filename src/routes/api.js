require("dotenv").config();
const router = require("express").Router();
const moment = require("moment");
const multer = require("multer");
const yourid = require("yourid");
const Image = require("../database/models/image");
const User = require("../database/models/User");

router.get("/", (req, res) => {
    res.render("api");
});

// Upload images with post request

// the maximum size of the file to be uploaded
const maxSize = 1 * 1000 * 1000;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },

    filename: (req, file, cb) => {
        const id = yourid.generate({
            length: 11,
            prefix: "",
            includePrefix: false,
        });

        try {
            const img = new Image({
                imageId: `${id}`,
                imageName: file.originalname,
                imagePath: `/uploads/${id}-${file.originalname}`,
                uploadedBy: req.user._id,
                uploadedAt: moment().format("MMMM Do YYYY"),
            });
            img.save();
        } catch (err) {
            console.log(err);
        }
        cb(null, `${id}-${file.originalname}`);
    },

    onFileUploadStart: function (file, req, res) {
        if (req.files.file.length > maxSize) {
            alert("File is too big!");
            return false;
        }
    },
});

const upload = multer({
    storage: fileStorage,
});

router.post("/upload/single", upload.single("image"), (req, res) => {
    res.render("uploaded", {
        image: req.file.filename,
        host: process.env.HOST,
    });
});

router.post("/upload/multiple", upload.array("images", 3), (req, res) => {
    res.send("File upload multiple success!");
});

// Get images

router.get("/uploads", (req, res) => {
    const apiKey = User.find({ apiKey: req.query.apiKey });

    if (!apiKey) {
        res.json({
            error: "Api key is invalid",
            error_id: yourid.generate({
                length: 11,
                prefix: "",
                includePrefix: false,
            }),
            timestamp: new Date().toISOString(),
        });
    } else {
        Image.find({}, (err, images) => {
            const filteredImages = images.map((image) => {
                return {
                    ID: image.imageId,
                    name: image.imageName,
                    path: process.env.HOST + image.imagePath,
                    apiPath: process.env.HOST + "/api/uploads/" + image.imageId,
                    uploadedAt: image.uploadedAt,
                };
            });
            res.send(filteredImages);
        });
    }
});

router.get("/users", (req, res) => {
    const apiKey = User.find({ apiKey: req.query.apiKey });

    if (!apiKey) {
        res.json({
            error: "Api key is invalid",
            error_id: yourid.generate({
                length: 11,
                prefix: "",
                includePrefix: false,
            }),
            timestamp: new Date().toISOString(),
        });
    } else {
        User.find({}, (err, users) => {
            const filteredUsers = users.map((user) => {
                return {
                    userName: user.userName,
                    userMagikId: user.userMagikId,
                    userDisplayName: user.displayName,
                    userProvider: user.provider,
                    userProfilePicture: user.profilePicture,
                    userBio: user.userBio,
                    userPath: process.env.HOST + "/profile/" + user.userMagikId,
                    userApiPath:
                        process.env.HOST + "/api/users/" + user.userMagikId,
                    userJoined: user.joinedAt,
                    userRole: user.userRole,
                    premium: user.premium,
                    verified: user.verified,
                };
            });
            res.send(filteredUsers);
        });
    }
});

router.get("/uploads/:id", (req, res) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.json({
                status: 404,
                error: "User not found",
                error_id: yourid.generate(30),
                timestamp: new Date().toISOString(),
            });
        } else {
            res.send({
                ID: image.imageId,
                name: image.imageName,
                path: process.env.HOST + image.imagePath,
                uploadedAt: image.uploadedAt,
            });
        }
    });
});

router.get("/users/:id", (req, res) => {
    // filter the user
    User.findOne({ userMagikId: req.params.id }, (err, user) => {
        if (err) {
            res.json({
                status: 404,
                error: "User not found",
                error_id: yourid.generate(30),
                timestamp: new Date().toISOString(),
            });
        } else {
            res.send({
                userName: user.userName,
                userMagikId: user.userMagikId,
                userDisplayName: user.displayName,
                userProvider: user.provider,
                userProfilePicture: user.profilePicture,
                userBio: user.userBio,
                userPath: process.env.HOST + "/profile/" + user.userMagikId,
                userApiPath:
                    process.env.HOST + "/api/users/" + user.userMagikId,
                userJoined: user.joinedAt,
                userRole: user.userRole,
                premium: user.premium,
                verified: user.verified,
            });
        }
    });
});

// Delete requests
router.get("/delete", (req, res) => {
    User.findOneAndDelete({ userId: req.user.userId }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/delete/image/:id", (req, res) => {
    Image.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/dashboard?deleted=true&id=" + user._id);
        }
    });
});

router.get("/delete/user/:id", (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/dashboard/admin?deleted=true&id=" + user._id);
        }
    });
});

router.get("/update/user/:id", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.id, displayName: req.body.displayName },
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/dashboard/admin?deleted=true&id=" + user._id);
            }
        }
    );
});

module.exports = router;
