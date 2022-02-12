const router = require("express").Router();
const Image = require("../database/models/image");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index");
});

router.get("/upload", (req, res) => {
    res.render("upload");
});

router.get("/dashboard", ensureAuth, (req, res) => {
    res.render("dashboard");
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
