const mongoose = require("mongoose");
const Image = require("./image");

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

    userBio: {
        type: String,
        default: "This user has no bio. 🥴",
    },

    profilePicture: {
        type: String,
        required: true,
    },

    images: {
        type: Array,
    },

    joinedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("GithubUser", GithubUserSchema);
