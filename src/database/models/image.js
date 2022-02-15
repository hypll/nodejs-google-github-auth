const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    imageId: {
        type: String,
        required: true,
    },

    imageName: {
        type: String,
        required: true,
    },

    imagePath: {
        type: String,
        required: true,
    },

    uploadedBy: {
        type: String,
        required: true,
        unique: false,
    },

    uploadedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Image", ImageSchema);
