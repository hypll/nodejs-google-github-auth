const mongoose = require("mongoose");

const yourid = require("yourid");

const GithubUserSchema = new mongoose.Schema({
    githubId: {
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
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("GithubUser", GithubUserSchema);
