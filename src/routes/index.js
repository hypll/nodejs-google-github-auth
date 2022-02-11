const router = require("express").Router();
const Image = require("../database/models/image");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/upload", (req, res) => {
    res.render("upload");
});

router.get("/view/:id", (req, res, next) => {
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
