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

    displayName: {
        type: String,
    },

    userName: {
        type: String,
        required: true,
    },

    userBio: {
        type: String,
        default: "This user has no bio.",
    },

    provider: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        required: true,
    },

    premium: {
        type: Boolean,
        default: false,
    },

    verified: {
        type: Boolean,
        default: false,
    },

    apiKey: {
        type: String,
        required: true,
    },

    joinedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);
