const router = require("express").Router();
const multer = require("multer");
const yourid = require("yourid");
const Image = require("../database/models/image");
const moment = require("moment");

router.get("/", (req, res) => {
    res.render("api");
});

// Upload images with post request

// the maximum size of the file to be uploaded
var maxSize = 1 * 1000 * 1000;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },

    filename: (req, file, cb) => {
        const id = yourid.generate(15);
        const img = new Image({
            imageId: `${id}`,
            imageName: file.originalname,
            imagePath: `/uploads/${id}-${file.originalname}`,
            uploadedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
        });
        img.save();
        cb(null, `${id}-${file.originalname}`);
    },

    onFileUploadStart: function (file, req, res) {
        if (req.files.file.length > maxSize) {
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
    });
});

router.post("/upload/multiple", upload.array("images", 3), (req, res) => {
    res.send("File upload multiple success!");
});

// Get images

router.get("/uploads", (req, res) => {
    const key = req.query.key;
    Image.find({}, (err, images) => {
        if (key === process.env.KEY) {
            res.send(images);
        } else {
            res.json({
                status: 204,
                error: "Unauthorized",
                error_id: yourid.generate(30),
                timestamp: new Date().toISOString(),
            });
        }
    });
});

router.get("/uploads/:id", (req, res) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.send("Image was not found!");
        } else {
            res.send(image);
        }
    });
});

module.exports = router;
