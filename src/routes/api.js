require("dotenv").config();
const router = require("express").Router();
const moment = require("moment");
const multer = require("multer");
const yourid = require("yourid");
const Image = require("../database/models/image");
const User = require("../database/models/User");
const FileSize = require("filesize");
const nodemailer = require("nodemailer");

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
                uploadedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
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
    if (!req.isAuthenticated()) {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate({
                length: 11,
                prefix: "",
                includePrefix: false,
            }),
            timestamp: new Date().toISOString(),
        });
    } else {
        Image.find({}, (err, images) => {
            res.send(images);
        });
    }
});

router.get("/users", (req, res) => {
    if (!req.isAuthenticated()) {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate({
                length: 11,
                prefix: "",
                includePrefix: false,
            }),
            timestamp: new Date().toISOString(),
        });
    } else {
        const key = req.query.key;
        User.find({}, (err, users) => {
            res.send(users);
        });
    }
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

router.get("/users/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate(30),
            timestamp: new Date().toISOString(),
        });
    } else {
        User.findOne({ id: req.params._id }, (err, user) => {
            if (err) {
                res.send("User was not found!");
            } else {
                res.send(user);
            }
        });
    }
});

// User Update

//  create a route that updates the user's bio
router.get("/update/bio/:id", (req, res) => {
    if (!req.isAuthenticated()) {
        res.json({
            status: 204,
            error: "Unauthorized",
            error_id: yourid.generate(30),
            timestamp: new Date().toISOString(),
        });
    } else {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { userBio: req.body.userBio },
            { new: true },
            { upsert: true },
            (err, user) => {
                if (err) {
                    res.send("User was not found!");
                } else {
                    res.redirect("/dashboard?updateKey=" + user.userId);
                }
            }
        );
    }
});

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

module.exports = router;
