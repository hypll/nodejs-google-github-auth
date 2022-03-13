const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },

    site_admin: {
        type: Boolean,
        required: true,
        default: false,
    },

    displayName: {
        type: String,
    },

    username: {
        type: String,
        required: true,
    },

    bio: {
        type: String,
        default: "This user has no bio.",
    },

    provider: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);
