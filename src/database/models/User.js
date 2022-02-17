const mongoose = require("mongoose");
const Image = require("./image");
const yourid = require("yourid");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    userMagikId: {
        type: String,
        required: true,
        unique: true,
        default: yourid.generate({
            length: 12,
            prefix: "",
            includePrefix: false,
        }),
    },

    displayName: {
        type: String,
    },

    userName: {
        type: String,
        required: true,
    },

    userBio: {
        type: String,
        default: "This user has no bio. 🥴",
    },

    provider: {
        type: String,
        required: true,
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

module.exports = mongoose.model("User", UserSchema);
