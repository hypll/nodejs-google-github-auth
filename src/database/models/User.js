const mongoose = require("mongoose");
const id = require("yourid");

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

    userEmail: {
        type: String,
        // required: true,
        unique: true,
    },

    userStorage: {
        type: Number,
        default: 0,
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

    apiKey: {
        type: String,
        required: true,
        default: id.generate({ length: 30, prefix: "", includePrefix: false }),
    },

    joinedAt: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);
