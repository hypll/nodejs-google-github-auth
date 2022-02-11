require("dotenv").config();
const express = require("express");
const multer = require("multer");
const yourid = require("yourid");
const path = require("path");
const moment = require("moment");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

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
        cb(null, `${id}.${file.originalname}`);
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

app.post("/api/upload/single", upload.single("image"), (req, res) => {
    res.render("uploaded", {
        image: req.file.filename,
    });
});

app.post("/api/upload/multiple", upload.array("images", 3), (req, res) => {
    res.send("File upload multiple success!");
});

app.get("/api", (req, res) => {
    res.send(
        "API endpoints <br> <strong>POST</strong> <pre>/api/upload/single</pre> (This will upload a single image)"
    );
});

app.get("/api/uploads/:id", (req, res) => {
    Image.findOne({ imageId: req.params.id }, (err, image) => {
        if (err) {
            res.send("Image was not found!");
        } else {
            res.send(image);
        }
    });
});

app.get("/api/uploads", (req, res) => {
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

app.get("/view/:id", (req, res, next) => {
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

// database stuff
const mongoose = require("mongoose");

// Connect to the database
mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.info("Connected to the monogoDB!")
);

const Image = mongoose.model("Image", {
    imageId: String,
    imageName: String,
    imagePath: String,
    uploadedAt: String,
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
