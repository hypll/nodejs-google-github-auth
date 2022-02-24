const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    userMagikId: {
        type: String,
        required: true,
    },

    userRole: {
        type: String,
        default: "user",
    },

    userStorage: {
        type: Number,
        default: 4000000,
    },

    displayName: {
        type: String,
    },

    userName: {
        type: String,
        required: true,
    },

    userStorage: {
        type: Number,
        default: 0,
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

    premium: {
        type: Boolean,
        default: false,
    },

    joinedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);
