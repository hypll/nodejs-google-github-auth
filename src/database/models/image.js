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

    uploadedBy: {
        type: String,
        required: true,
    },

    uploadedAt: {
        type: String,
        default: Date.now,
    },
});

module.exports = mongoose.model("Image", ImageSchema);
