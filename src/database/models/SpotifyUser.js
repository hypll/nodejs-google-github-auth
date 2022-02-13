const mongoose = require("mongoose");

const yourid = require("yourid");

const SpotifyUserSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        required: true,
        unique: true,
    },

    displayId: {
        type: String,
        default: yourid.generate(10),
    },

    displayName: {
        type: String || "This user has no displayName.",
    },

    userName: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        required: true,
    },

    uploadedImages: {
        type: Array,
        default: [],
    },

    joinedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("SpotifyUser", SpotifyUserSchema);
