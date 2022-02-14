const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    imageId: {
        type: String,
        required: true,
        unique: true,
    },

    imageName: {
        type: String,
        required: true,
    },

    imagePath: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GithubUser",
    },

    uploadedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Image", ImageSchema);
